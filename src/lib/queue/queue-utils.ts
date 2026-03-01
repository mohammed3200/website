import { Queue } from 'bullmq';

/**
 * Creates a mock BullMQ Queue for use during the Next.js static build phase.
 * This prevents the build process from attempting to connect to Redis.
 */
export function createMockQueue(name: string): Queue {
    return {
        name,
        add: async () => ({ id: `mock-job-${Date.now()}` }),
        getJob: async () => null,
        getJobs: async () => [],
        pause: async () => { },
        resume: async () => { },
        clean: async () => [],
        close: async () => { },
    } as unknown as Queue;
}
