import { Worker, Job } from 'bullmq';
import { redis } from '@/lib/redis';
import { emailService, type EmailOptions } from '@/lib/email/service';
import { EMAIL_QUEUE_NAME } from './email-queue';

export const emailWorker = new Worker(
    EMAIL_QUEUE_NAME,
    async (job: Job<EmailOptions>) => {
        console.log(`Processing email job ${job.id} to ${job.data.to}`);

        // Use existing email service to send
        const result = await emailService.sendEmail(job.data);

        if (!result.success) {
            throw new Error(result.error || 'Failed to send email');
        }

        return result;
    },
    {
        connection: redis,
        concurrency: 5,
        limiter: {
            max: 10,
            duration: 1000, // Max 10 emails per second
        }
    }
);

emailWorker.on('completed', (job) => {
    console.log(`Email job ${job.id} completed`);
});

emailWorker.on('failed', (job, err) => {
    console.error(`Email job ${job?.id} failed: ${err.message}`);
});
