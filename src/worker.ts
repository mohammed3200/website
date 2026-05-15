import { reportWorker } from '@/lib/queue/report-worker';
import { emailWorker } from '@/lib/queue/email-worker';
import { whatsappWorker } from '@/lib/queue/whatsapp-worker';
import { Queue, Worker } from 'bullmq';
import { redis } from '@/lib/redis';
import { cleanupExpiredTokens } from '@/lib/queue/token-cleanup';

// System queue for scheduled maintenance tasks
const systemQueue = new Queue('system-queue', { connection: redis });

const systemWorker = new Worker('system-queue', async (job) => {
  if (job.name === 'token-cleanup') {
    await cleanupExpiredTokens();
  }
}, { connection: redis });

// Schedule the token cleanup job to run daily at 3 AM
systemQueue.add('token-cleanup', {}, {
  repeat: { pattern: '0 3 * * *' },
  jobId: 'daily-token-cleanup' // Ensure it's not added multiple times
});

console.log('👷 Background worker started...');
console.log('listening on queues:');
console.log(`- ${reportWorker.name}`);
console.log(`- ${emailWorker.name}`);
console.log(`- ${whatsappWorker.name}`);
console.log(`- ${systemWorker.name}`);

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Shutting down workers...');
  await Promise.all([
    reportWorker.close(),
    emailWorker.close(),
    whatsappWorker.close(),
    systemWorker.close(),
    systemQueue.close(),
  ]);
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
