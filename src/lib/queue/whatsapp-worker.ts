import { Worker, type Job } from 'bullmq';
import { redis } from '@/lib/redis';
import { whatsAppService } from '@/lib/whatsapp/service';
import { WHATSAPP_QUEUE_NAME, type WhatsAppJobPayload } from './whatsapp-queue';

/**
 * BullMQ worker that consumes the WhatsApp queue and routes each job through
 * WhatsAppService.sendMessage(). Runs alongside emailWorker in src/worker.ts.
 *
 * Retry policy, DLQ, and rate-limit are configured here; the queue defaults
 * (defined in whatsapp-queue.ts) handle attempts/backoff at job enqueue time.
 */
export const whatsappWorker = new Worker<WhatsAppJobPayload>(
  WHATSAPP_QUEUE_NAME,
  async (job: Job<WhatsAppJobPayload>) => {
    const { to, body, options } = job.data;
    console.log(
      `Processing WhatsApp job ${job.id} (attempt ${job.attemptsMade + 1}/${job.opts.attempts}) to ${to}`,
    );

    const result = await whatsAppService.sendMessage(to, body, options || {});

    if (!result.success) {
      // Throwing makes BullMQ retry per the queue's exponential backoff.
      throw new Error(result.error || 'WhatsApp send returned !success');
    }

    return { messageId: result.messageId };
  },
  {
    connection: redis,
    concurrency: 5,
    limiter: { max: 10, duration: 1000 }, // 10 msg/sec ceiling
  },
);

whatsappWorker.on('completed', (job, returnValue) => {
  console.log(
    `WhatsApp job ${job.id} completed. messageId=${(returnValue as { messageId?: string })?.messageId || 'n/a'}`,
  );
});

whatsappWorker.on('failed', (job, err) => {
  console.error(
    `WhatsApp job ${job?.id} failed (attempt ${job?.attemptsMade}/${job?.opts.attempts}): ${err.message}`,
  );
});
