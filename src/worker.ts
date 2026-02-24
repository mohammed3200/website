import { reportWorker } from '@/lib/queue/report-worker';
import { emailWorker } from '@/lib/queue/email-worker';
import { whatsappWorker } from '@/lib/queue/whatsapp-worker';

console.log('👷 Background worker started...');
console.log('listening on queues:');
console.log(`- ${reportWorker.name}`);
console.log(`- ${emailWorker.name}`);
console.log(`- ${whatsappWorker.name}`);

// Handle graceful shutdown
const shutdown = async () => {
  console.log('Shutting down workers...');
  await Promise.all([
    reportWorker.close(),
    emailWorker.close(),
    whatsappWorker.close(),
  ]);
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
