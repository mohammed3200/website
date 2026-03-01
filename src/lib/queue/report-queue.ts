import { Queue } from 'bullmq';
import { redis } from '@/lib/redis';
import { isBuildPhase } from '@/lib/env-utils';

export const REPORT_QUEUE_NAME = 'report-generation';

export const reportQueue = isBuildPhase
    ? ({ add: async () => ({ id: `mock-job-${Date.now()}` }) } as unknown as Queue)
    : new Queue(REPORT_QUEUE_NAME, {
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
