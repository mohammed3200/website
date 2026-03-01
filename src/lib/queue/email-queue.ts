import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';
import { isBuildPhase } from '@/lib/env-utils';

export const EMAIL_QUEUE_NAME = 'email-sending';

export const emailQueue = isBuildPhase
    ? ({ add: async () => console.log('Mock queue add in build phase') } as unknown as Queue)
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
