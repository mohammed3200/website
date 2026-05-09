import { describe, it, expect, beforeEach, afterAll, mock, jest } from 'bun:test';

// In-memory mock prisma client. We capture every findFirst / create / update
// invocation so the seed's idempotency contract can be asserted directly.
type Row = {
  id: string;
  page: string;
  section: string;
  order: number;
  titleAr: string;
  titleEn: string;
  contentAr: string | null;
  contentEn: string | null;
  icon: string | null;
  isActive: boolean;
};

const store: Row[] = [];
let nextId = 1;

const mockPrisma = {
  pageContent: {
    findFirst: jest.fn(({ where }: { where: any }) => {
      const row =
        store.find(
          (r) =>
            r.page === where.page &&
            r.section === where.section &&
            r.order === where.order,
        ) ?? null;
      return Promise.resolve(row);
    }),
    create: jest.fn(({ data }: { data: any }) => {
      const row: Row = {
        id: data.id ?? `row-${nextId++}`,
        page: data.page,
        section: data.section,
        order: data.order,
        titleAr: data.titleAr,
        titleEn: data.titleEn,
        contentAr: data.contentAr ?? null,
        contentEn: data.contentEn ?? null,
        icon: data.icon ?? null,
        isActive: data.isActive ?? true,
      };
      store.push(row);
      return Promise.resolve(row);
    }),
    update: jest.fn(({ where, data }: { where: any; data: any }) => {
      const row = store.find((r) => r.id === where.id);
      if (!row) throw new Error(`row ${where.id} not found`);
      Object.assign(row, data);
      return Promise.resolve(row);
    }),
  },
  $disconnect: jest.fn(),
};

mock.module('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

mock.module('@prisma/adapter-mariadb', () => ({
  PrismaMariaDb: jest.fn().mockImplementation(() => ({})),
}));

// Importing the seed module runs the top-of-file DATABASE_URL guard, so the
// env var must be set before the dynamic import below.
const originalEnv = { ...process.env };
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test';
process.env.NODE_ENV = 'test';

// Dynamic import so the module-level adapter setup happens after the mocks above.
const { seed } = await import('../../prisma/seed-ebic-page-content');

describe('EBIC seed-ebic-page-content', () => {
  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    store.length = 0;
    nextId = 1;
    mockPrisma.pageContent.findFirst.mockClear();
    mockPrisma.pageContent.create.mockClear();
    mockPrisma.pageContent.update.mockClear();
  });

  it('seeds the exact source-of-truth record counts', async () => {
    await seed();

    const groupCount = (page: string, section: string) =>
      store.filter((r) => r.page === page && r.section === section).length;

    expect(groupCount('about', 'hero')).toBe(1);
    expect(groupCount('about', 'platform')).toBe(1);
    expect(groupCount('about', 'goals')).toBe(5);
    expect(groupCount('about', 'news')).toBe(1);
    expect(groupCount('entrepreneurship', 'goals')).toBe(6);
    expect(groupCount('incubators', 'tasks')).toBe(5);
    expect(store.length).toBe(19);
  });

  it('upserts the new center name on the about/hero record', async () => {
    await seed();
    const hero = store.find((r) => r.page === 'about' && r.section === 'hero');
    expect(hero?.titleAr).toBe(
      'مركز الريادة والحاضنات والتطوير التقني - مصراتة',
    );
    expect(hero?.titleEn).toBe(
      'Entrepreneurship, Incubators & Technical Development Center - Misrata',
    );
  });

  it('flags the news record as inactive by default', async () => {
    await seed();
    const news = store.find((r) => r.page === 'about' && r.section === 'news');
    expect(news?.isActive).toBe(false);
  });

  it('uses lucide icon names from the source-of-truth contract', async () => {
    await seed();
    const iconsByPageSection = (page: string, section: string) =>
      store
        .filter((r) => r.page === page && r.section === section)
        .sort((a, b) => a.order - b.order)
        .map((r) => r.icon);

    expect(iconsByPageSection('about', 'goals')).toEqual([
      'Lightbulb',
      'Users',
      'Rocket',
      'TrendingUp',
      'Handshake',
    ]);
    expect(iconsByPageSection('entrepreneurship', 'goals')).toEqual([
      'Megaphone',
      'Brain',
      'Lightbulb',
      'GraduationCap',
      'Sparkles',
      'FlaskConical',
    ]);
    expect(iconsByPageSection('incubators', 'tasks')).toEqual([
      'Building2',
      'MessageSquare',
      'DollarSign',
      'BarChart3',
      'Factory',
    ]);
  });

  it('is idempotent: running seed twice yields the same DB state', async () => {
    await seed();
    const snapshot = store
      .map((r) => `${r.page}/${r.section}#${r.order}::${r.titleEn}`)
      .sort();
    const firstRunCreates = mockPrisma.pageContent.create.mock.calls.length;

    mockPrisma.pageContent.create.mockClear();
    mockPrisma.pageContent.update.mockClear();

    await seed();
    const second = store
      .map((r) => `${r.page}/${r.section}#${r.order}::${r.titleEn}`)
      .sort();

    expect(second).toEqual(snapshot);
    expect(store.length).toBe(snapshot.length);
    // First run: every record is created. Second run: zero creates, every record updates.
    expect(firstRunCreates).toBe(snapshot.length);
    expect(mockPrisma.pageContent.create.mock.calls.length).toBe(0);
    expect(mockPrisma.pageContent.update.mock.calls.length).toBe(snapshot.length);
  });
});
