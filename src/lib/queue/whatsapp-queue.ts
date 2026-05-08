/**
 * WhatsApp BullMQ queue + enqueue helper.
 *
 * Mirrors the email queue pattern: same retry policy, same Redis fallback,
 * same dead-letter semantics.
 */
import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';
import { isBuildPhase } from '@/lib/env-utils';
import { createMockQueue } from './queue-utils';

export const WHATSAPP_QUEUE_NAME = 'whatsapp-queue';

const useMockQueue = isBuildPhase || !process.env.REDIS_URL;

export const whatsappQueue = useMockQueue
  ? createMockQueue(WHATSAPP_QUEUE_NAME)
  : new Queue(WHATSAPP_QUEUE_NAME, {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: { age: 24 * 3600, count: 1000 },
        removeOnFail: false, // keep failures so the DLQ is inspectable
      },
    });

export interface WhatsAppJobPayload {
  to: string;
  body: string;
  options?: {
    marketing?: boolean;
    templateSlug?: string;
  };
  /** Optional correlation key, useful for tying queue jobs to Message rows. */
  correlationId?: string;
}

/**
 * Enqueue a WhatsApp message. Returns the BullMQ job id (or a mock id when
 * Redis is unavailable — in that case the job will not be sent; callers
 * should treat the response as "best effort").
 */
export async function enqueueWhatsApp(
  payload: WhatsAppJobPayload,
): Promise<{ jobId: string; queued: boolean }> {
  try {
    const job = await whatsappQueue.add('send-whatsapp', payload);
    return { jobId: job.id || '', queued: !useMockQueue };
  } catch (err) {
    console.error('[whatsapp-queue] add failed:', err);
    return { jobId: '', queued: false };
  }
}

/**
 * Read queue health metrics.
 */
export async function getWhatsAppQueueHealth() {
  if (useMockQueue) {
    return {
      queue: WHATSAPP_QUEUE_NAME,
      mock: true,
      waiting: 0,
      active: 0,
      completed: 0,
      failed: 0,
      delayed: 0,
    };
  }
  const counts = await whatsappQueue.getJobCounts(
    'waiting',
    'active',
    'completed',
    'failed',
    'delayed',
  );
  return { queue: WHATSAPP_QUEUE_NAME, mock: false, ...counts };
}
