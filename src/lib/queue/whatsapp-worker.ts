import { Worker } from 'bullmq';
import { whatsAppService } from '@/lib/whatsapp/service';
import { db } from '@/lib/db';
import { MessageStatus } from '@prisma/client';

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const whatsappWorker = new Worker(
  'whatsapp-queue',
  async (job) => {
    const { to, body, options } = job.data;
    console.log(`Processing WhatsApp job ${job.id} to ${to}`);

    try {
      const result = await whatsAppService.sendMessage(to, body, options);

      if (!result.success) {
        throw new Error(result.error);
      }

      console.log(
        `WhatsApp job ${job.id} completed. Message ID: ${result.messageId}`,
      );
    } catch (error: any) {
      console.error(`WhatsApp job ${job.id} failed:`, error);

      // Optionally update a specific Message record if strict tracking is needed here,
      // though service.ts already handles logging to WhatsAppLog.
      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10, // Max 10 messages
      duration: 1000, // per 1 second (rate limiting)
    },
  },
);
