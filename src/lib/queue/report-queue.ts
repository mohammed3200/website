import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';

export const REPORT_QUEUE_NAME = 'report-generation';

export const reportQueue = new Queue(REPORT_QUEUE_NAME, {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
});
