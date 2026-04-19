import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';
import { isBuildPhase } from '@/lib/env-utils';
import { createMockQueue } from './queue-utils';

export const EMAIL_QUEUE_NAME = 'email-sending';

const useMockQueue = isBuildPhase || !process.env.REDIS_URL;

export const emailQueue = useMockQueue
    ? createMockQueue(EMAIL_QUEUE_NAME)
    : new Queue(EMAIL_QUEUE_NAME, {
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
