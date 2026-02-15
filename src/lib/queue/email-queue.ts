import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';

export const EMAIL_QUEUE_NAME = 'email-sending';

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
