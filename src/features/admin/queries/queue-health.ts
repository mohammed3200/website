/**
 * Server-side fetcher: live BullMQ counts for email + WhatsApp queues plus
 * recent failure stats (last 24 h) summarised from the EmailLog and
 * WhatsAppLog tables. Cached briefly so the dashboard doesn't hammer Redis.
 *
 * Cache key: `dashboard:queues`  TTL: 60 s (queue counts move fast — short
 * TTL keeps the panel honest without flooding Redis on every refresh).
 */
import { emailQueue } from '@/lib/queue/email-queue';
import { whatsappQueue } from '@/lib/queue/whatsapp-queue';
import { db } from '@/lib/db';
import { EmailStatus, MessageStatus } from '@prisma/client';
import { cache } from '@/lib/cache';

export interface QueueHealthSnapshot {
  queue: 'email' | 'whatsapp';
  /** True when the queue is the LRU mock (REDIS_URL absent or build phase). */
  mock: boolean;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  timedOut: number;
  /** Total log rows over the last 24 h, broken down by status. */
  last24h: {
    sent: number;
    failed: number;
  };
}

async function snapshotEmail(): Promise<QueueHealthSnapshot> {
  const counts = (await safeCounts(emailQueue)) || mockCounts();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [sent, failed] = await Promise.all([
    db.emailLog.count({ where: { status: EmailStatus.SENT, createdAt: { gte: since } } }),
    db.emailLog.count({ where: { status: EmailStatus.FAILED, createdAt: { gte: since } } }),
  ]);
  return { queue: 'email', mock: !process.env.REDIS_URL, ...counts, last24h: { sent, failed } };
}

async function snapshotWhatsApp(): Promise<QueueHealthSnapshot> {
  const counts = (await safeCounts(whatsappQueue)) || mockCounts();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [sent, failed] = await Promise.all([
    db.whatsAppLog.count({ where: { status: MessageStatus.SENT, createdAt: { gte: since } } }),
    db.whatsAppLog.count({ where: { status: MessageStatus.FAILED, createdAt: { gte: since } } }),
  ]);
  return { queue: 'whatsapp', mock: !process.env.REDIS_URL, ...counts, last24h: { sent, failed } };
}

interface QueueLike {
  getJobCounts(...states: string[]): Promise<Record<string, number>>;
}

async function safeCounts(
  q: QueueLike,
): Promise<Pick<QueueHealthSnapshot, 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'timedOut'> | null> {
  // Race against a 2 s deadline so a wedged Redis can't block the dashboard.
  const timeout = new Promise<null>((res) => setTimeout(() => res(null), 2_000));
  try {
    const result = await Promise.race([
      q.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed', 'timedOut'),
      timeout,
    ]);
    if (!result) return null;
    const c = result as Record<string, number>;
    return {
      waiting: c.waiting ?? 0,
      active: c.active ?? 0,
      completed: c.completed ?? 0,
      failed: c.failed ?? 0,
      delayed: c.delayed ?? 0,
      timedOut: c.timedOut ?? 0,
    };
  } catch {
    return null;
  }
}

function mockCounts() {
  return { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, timedOut: 0 };
}

export async function getEmailQueueHealth() {
  // Short cache so the dashboard sees fresh data within 60 s of any change.
  // The whole call is raced against a 5 s deadline so a wedged Redis cannot
  // block the dashboard request.
  const fallback = (): Awaited<ReturnType<typeof snapshotEmail>>[] => [
    { queue: 'email', mock: true, waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, timedOut: 0, last24h: { sent: 0, failed: 0 } } as QueueHealthSnapshot,
    { queue: 'whatsapp', mock: true, waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, timedOut: 0, last24h: { sent: 0, failed: 0 } } as QueueHealthSnapshot,
  ];

  const work = cache.getOrSet(
    'dashboard:queues',
    async () => ({
      email: await snapshotEmail(),
      whatsapp: await snapshotWhatsApp(),
    }),
    60,
  );
  const timeout = new Promise<{ email: QueueHealthSnapshot; whatsapp: QueueHealthSnapshot }>((res) =>
    setTimeout(() => {
      const [e, w] = fallback();
      res({ email: e, whatsapp: w });
    }, 5_000),
  );
  return Promise.race([work, timeout]);
}
