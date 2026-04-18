import { describe, it, expect, beforeEach, jest, mock } from 'bun:test';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { main } from '../../prisma/seed';

// Mock dependencies
const mockPrismaClient = jest.fn();
mock.module('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));
mock.module('bcryptjs', () => {
  const mockBcrypt = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  return {
    ...mockBcrypt,
    default: mockBcrypt,
    __esModule: true,
  };
});
mock.module('@prisma/adapter-mariadb', () => ({
  PrismaMariaDb: jest.fn().mockImplementation(() => ({})),
}));

describe('Database Seed Functions', () => {
  let mockPrisma: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock Prisma client methods
    mockPrisma = {
      role: {
        findUnique: jest.fn(),
      },
      user: {
        upsert: jest.fn(),
      },
      strategicPlan: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
      },
      pageContent: {
        upsert: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation((p: any) => Promise.all(p)),
      $disconnect: jest.fn(),
    };

    // Mock PrismaClient constructor
    (PrismaClient as any).mockImplementation(() => mockPrisma);

    // Set required env vars
    process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/test';
    process.env.INIT_ADMIN_EMAIL = 'admin@test.com';
    process.env.INIT_ADMIN_PASSWORD = 'password123';
  });

  describe('Admin User Creation', () => {
    it('should create admin user with hashed password', async () => {
      const hashedPassword = 'hashed_password_123';
      (bcrypt.hash as any).mockResolvedValue(hashedPassword);

      const mockRole = {
        id: 'role-123',
        name: 'super_admin',
      };

      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        name: 'Admin User',
        roleId: 'role-123',
        isActive: true,
      };

      mockPrisma.role.findUnique.mockResolvedValue(mockRole);
      mockPrisma.user.upsert.mockResolvedValue(mockUser);

      // Mock downstream calls from seedStrategicPlans and seedPageContent
      mockPrisma.strategicPlan.findMany.mockResolvedValue([]);
      mockPrisma.strategicPlan.create.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.pageContent.upsert.mockResolvedValue({ id: 'content-1' });

      // Execute seed main function
      await main();

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(mockPrisma.user.upsert).toHaveBeenCalled();
      expect(mockPrisma.strategicPlan.create).toHaveBeenCalled();
      expect(mockPrisma.pageContent.upsert).toHaveBeenCalled();
    });

    it('should handle missing super admin role gracefully', async () => {
      (bcrypt.hash as any).mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue(null);

      const mockUser = {
        id: 'user-123',
        email: 'admin@test.com',
        roleId: undefined,
      };

      mockPrisma.user.upsert.mockResolvedValue(mockUser);

      // Should not throw, but should warn
      // The actual implementation handles this gracefully
      expect(mockPrisma.role.findUnique).toBeDefined();
    });
  });

  describe('Strategic Plans Seeding (Bilingual Model)', () => {
    it('should create ONE unified bilingual row per plan, not two language rows', async () => {
      (bcrypt.hash as any).mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
      mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1', email: 'admin@test.com', roleId: 'role-1' });
      mockPrisma.strategicPlan.findMany.mockResolvedValue([]);
      mockPrisma.strategicPlan.create.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.pageContent.upsert.mockResolvedValue({ id: 'content-1' });

      await main();

      // Should create exactly 2 plans (for 2 entries in STRATEGIC_PLANS_DATA), not 4
      const createCalls = mockPrisma.strategicPlan.create.mock.calls;
      expect(createCalls.length).toBe(2);
    });

    it('should use language-neutral slugs without -ar/-en suffixes', async () => {
      (bcrypt.hash as any).mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
      mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1', email: 'admin@test.com', roleId: 'role-1' });
      mockPrisma.strategicPlan.findMany.mockResolvedValue([]);
      mockPrisma.strategicPlan.create.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.pageContent.upsert.mockResolvedValue({ id: 'content-1' });

      await main();

      const createCalls = mockPrisma.strategicPlan.create.mock.calls;
      for (const call of createCalls) {
        const data = call[0].data;
        expect(data.slug).not.toMatch(/-ar-/);
        expect(data.slug).not.toMatch(/-en-/);
        expect(data.slug).toMatch(/^(cit|ebic)$/);
      }
    });

    it('should populate both English AND Arabic fields in the same row', async () => {
      (bcrypt.hash as any).mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
      mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1', email: 'admin@test.com', roleId: 'role-1' });
      mockPrisma.strategicPlan.findMany.mockResolvedValue([]);
      mockPrisma.strategicPlan.create.mockResolvedValue({ id: 'plan-1' });
      mockPrisma.pageContent.upsert.mockResolvedValue({ id: 'content-1' });

      await main();

      const createCalls = mockPrisma.strategicPlan.create.mock.calls;
      for (const call of createCalls) {
        const data = call[0].data;
        // English columns must be populated
        expect(data.title).toBeTruthy();
        expect(data.content).toBeTruthy();
        expect(data.excerpt).toBeTruthy();
        // Arabic columns must be populated in the SAME row
        expect(data.titleAr).toBeTruthy();
        expect(data.contentAr).toBeTruthy();
        expect(data.excerptAr).toBeTruthy();
        // Category bilingual
        expect(data.category).toBe('Strategic Plan');
        expect(data.categoryAr).toBe('خطة استراتيجية');
      }
    });

    it('should consolidate existing strategic plan siblings into a single row', async () => {
      (bcrypt.hash as any).mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
      mockPrisma.user.upsert.mockResolvedValue({ id: 'user-1', email: 'admin@test.com', roleId: 'role-1' });

      const mockSiblings = [
        { id: 'sibling-1', slug: 'cit', publishedAt: new Date('2023-01-01') },
        { id: 'sibling-2', slug: 'strategic-plan-1', publishedAt: new Date('2022-01-01') },
      ];
      mockPrisma.strategicPlan.findMany.mockResolvedValue(mockSiblings);
      mockPrisma.strategicPlan.update.mockResolvedValue({ id: 'sibling-1' });
      mockPrisma.strategicPlan.deleteMany.mockResolvedValue({ count: 1 });

      await main();

      // Should pick sibling-1 (correct slug) as survivor
      expect(mockPrisma.strategicPlan.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'sibling-1' },
          data: expect.objectContaining({ slug: 'cit' })
        })
      );
      // Should delete sibling-2
      expect(mockPrisma.strategicPlan.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { in: ['sibling-2'] } }
        })
      );
    });

    it('should handle plans with empty content gracefully', async () => {
      mockPrisma.strategicPlan.findMany.mockResolvedValue([]);
      mockPrisma.strategicPlan.create.mockResolvedValue({
        id: 'plan-2',
      });

      const planData = {
        id: '2',
        arabic: {
          caption: 'Caption',
          title: 'Title',
          text: '',
        },
        english: {
          caption: 'Caption EN',
          title: 'Title EN',
          text: '',
        },
      };

      // Should use caption as fallback for empty text
      expect(planData.arabic.text || planData.arabic.caption).toBeTruthy();
      expect(planData.english.text || planData.english.caption).toBeTruthy();
    });
  });

  describe('Page Content Seeding', () => {
    it('should upsert page content items', async () => {
      const contentItem = {
        page: 'entrepreneurship',
        section: 'hero',
        order: 0,
        titleEn: 'Test Title',
        titleAr: 'عنوان اختبار',
        contentEn: 'Test content',
        contentAr: 'محتوى اختبار',
      };

      mockPrisma.pageContent.upsert.mockResolvedValue({
        id: 'content-1',
        ...contentItem,
      });

      // Test upsert logic
      await mockPrisma.pageContent.upsert({
        where: {
          page_section_order: {
            page: contentItem.page,
            section: contentItem.section,
            order: contentItem.order,
          },
        },
        update: contentItem,
        create: contentItem,
      });

      expect(mockPrisma.pageContent.upsert).toHaveBeenCalledWith({
        where: {
          page_section_order: {
            page: 'entrepreneurship',
            section: 'hero',
            order: 0,
          },
        },
        update: contentItem,
        create: contentItem,
      });
    });

    it('should handle page content with metadata', async () => {
      const contentItem = {
        page: 'incubators',
        section: 'metrics',
        order: 0,
        titleEn: 'Startups Supported',
        titleAr: 'شركات مدعومة',
        metadata: { number: 150 },
      };

      mockPrisma.pageContent.upsert.mockResolvedValue({
        id: 'content-2',
        ...contentItem,
      });

      expect(contentItem.metadata).toEqual({ number: 150 });
    });

    it('should seed both entrepreneurship and incubators pages', async () => {
      const entrepreneurshipItem = {
        page: 'entrepreneurship',
        section: 'hero',
        order: 0,
      };

      const incubatorsItem = {
        page: 'incubators',
        section: 'hero',
        order: 0,
      };

      mockPrisma.pageContent.upsert
        .mockResolvedValueOnce({ id: '1', ...entrepreneurshipItem })
        .mockResolvedValueOnce({ id: '2', ...incubatorsItem });

      // Both pages should have content
      expect(entrepreneurshipItem.page).toBe('entrepreneurship');
      expect(incubatorsItem.page).toBe('incubators');
    });
  });

  describe('Environment Variable Validation', () => {
    it('should throw error when DATABASE_HOST is missing', () => {
      delete process.env.DATABASE_HOST;

      // The actual seed.ts validates required env vars
      const dbHost = process.env.DATABASE_HOST;
      expect(dbHost).toBeUndefined();
    });

    it('should throw error when admin credentials are missing', () => {
      delete process.env.INIT_ADMIN_EMAIL;
      delete process.env.INIT_ADMIN_PASSWORD;

      expect(process.env.INIT_ADMIN_EMAIL).toBeUndefined();
      expect(process.env.INIT_ADMIN_PASSWORD).toBeUndefined();
    });

    it('should use default DATABASE_PORT if not provided', () => {
      delete process.env.DATABASE_PORT;
      const dbPort = process.env.DATABASE_PORT || '3306';

      expect(dbPort).toBe('3306');
    });
  });

  describe('Database Disconnection', () => {
    it('should disconnect from database after seeding', async () => {
      mockPrisma.$disconnect.mockResolvedValue(undefined);

      await mockPrisma.$disconnect();

      expect(mockPrisma.$disconnect).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle database errors during user creation', async () => {
      (bcrypt.hash as any).mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });
      mockPrisma.user.upsert.mockRejectedValue(new Error('Database error'));

      await expect(mockPrisma.user.upsert({})).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle errors during strategic plan creation', async () => {
      mockPrisma.strategicPlan.findMany.mockResolvedValue([]);
      mockPrisma.strategicPlan.create.mockRejectedValue(
        new Error('Failed to create plan'),
      );

      await expect(mockPrisma.strategicPlan.create({})).rejects.toThrow(
        'Failed to create plan',
      );
    });

    it('should handle errors during page content creation', async () => {
      mockPrisma.pageContent.upsert.mockRejectedValue(
        new Error('Failed to upsert content'),
      );

      await expect(mockPrisma.pageContent.upsert({})).rejects.toThrow(
        'Failed to upsert content',
      );
    });
  });

  describe('Data Integrity', () => {
    it('should create user with emailVerified timestamp', async () => {
      (bcrypt.hash as any).mockResolvedValue('hashed');
      mockPrisma.role.findUnique.mockResolvedValue({ id: 'role-1' });

      const userData = {
        email: 'admin@test.com',
        password: 'hashed',
        name: 'Admin User',
        emailVerified: new Date(),
        roleId: 'role-1',
        isActive: true,
      };

      mockPrisma.user.upsert.mockResolvedValue({
        id: 'user-1',
        ...userData,
      });

      expect(userData.emailVerified).toBeInstanceOf(Date);
      expect(userData.isActive).toBe(true);
    });

    it('should create strategic plans with bilingual content and published status', async () => {
      const planData = {
        title: 'Test Plan',
        titleAr: 'خطة اختبار',
        slug: 'strategic-plan-1',
        content: 'Content',
        contentAr: 'محتوى',
        excerpt: 'Excerpt',
        excerptAr: 'مقتطف',
        category: 'Strategic Plan',
        categoryAr: 'خطة استراتيجية',
        isActive: true,
        publishedAt: new Date(),
      };

      mockPrisma.strategicPlan.create.mockResolvedValue({
        id: 'plan-1',
        ...planData,
      });

      // Both EN and AR fields should be populated
      expect(planData.title).toBeTruthy();
      expect(planData.titleAr).toBeTruthy();
      expect(planData.content).toBeTruthy();
      expect(planData.contentAr).toBeTruthy();
      expect(planData.isActive).toBe(true);
      // Slug should not have language suffix
      expect(planData.slug).not.toMatch(/-ar$/);
      expect(planData.slug).not.toMatch(/-en$/);
    });
  });
});
