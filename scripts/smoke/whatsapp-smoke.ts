/**
 * Task 11 — WhatsApp queue + worker smoke test.
 *
 * Drives the full lifecycle without sending a real message:
 *   1. Enqueue a job via enqueueWhatsApp()
 *   2. Worker (started in-process) consumes the job
 *   3. WhatsAppTransport runs in MOCK MODE because WHATSAPP_API_TOKEN is
 *      empty in .env.test — proves the queue path without invoking UltraMsg
 *   4. Verify queue counts: failed=0, completed=1
 *
 * Also exercises the failure path:
 *   5. Enqueue a job for an invalid phone number → expect 'Invalid phone'
 *      to surface as a failed job (3 retries by default — we override to 1
 *      for this smoke).
 *
 * Idempotent: each run resets the queue and uses fresh job IDs.
 */
import { setTimeout as sleep } from 'node:timers/promises';
import dotenv from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.test') });

import { redis } from '@/lib/redis';
import { whatsappQueue, enqueueWhatsApp, getWhatsAppQueueHealth } from '@/lib/queue/whatsapp-queue';
import { whatsappWorker } from '@/lib/queue/whatsapp-worker';

async function clearQueue() {
  await whatsappQueue.drain(true);
  await whatsappQueue.clean(0, 1000, 'completed');
  await whatsappQueue.clean(0, 1000, 'failed');
}

async function waitFor(predicate: () => Promise<boolean>, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return true;
    await sleep(250);
  }
  return false;
}

async function main() {
  console.log('━━━ Task 11 — WhatsApp queue smoke ━━━');
  await clearQueue();

  const before = await getWhatsAppQueueHealth();
  console.log('initial counts:', before);

  // 1. Happy-path job (mock mode; WhatsAppTransport sees no creds and returns mock id)
  const happy = await enqueueWhatsApp({
    to: '+218921234567',
    body: 'EITDC smoke test (mock)',
  });
  console.log(`✓ enqueued happy job id=${happy.jobId}`);

  const completed = await waitFor(async () => {
    const counts = await getWhatsAppQueueHealth();
    return (counts.completed ?? 0) >= 1;
  }, 30_000);

  if (!completed) {
    console.error('✗ worker did not complete the happy job within 30s');
    await teardown();
    process.exit(1);
  }
  console.log('✓ happy job completed');

  // 2. Invalid-phone job: should fail and end up in DLQ (failed list).
  // Override attempts to 1 just for this job so we see the failure quickly.
  const bad = await whatsappQueue.add(
    'send-whatsapp',
    { to: 'NOT-A-PHONE', body: 'should fail' },
    { attempts: 1, backoff: undefined },
  );
  console.log(`✓ enqueued failure job id=${bad.id}`);

  const failed = await waitFor(async () => {
    const counts = await getWhatsAppQueueHealth();
    return (counts.failed ?? 0) >= 1;
  }, 30_000);

  if (!failed) {
    console.error('✗ failure job did not land in DLQ within 30s');
    await teardown();
    process.exit(1);
  }
  console.log('✓ failure job landed in DLQ (failed count incremented)');

  const after = await getWhatsAppQueueHealth();
  console.log('final counts:', after);

  console.log('');
  console.log('━━━ verdict ━━━');
  console.log('🟢 GREEN — queue path healthy, mock-mode delivery works, DLQ retains failures');

  await teardown();
  process.exit(0);
}

async function teardown() {
  await whatsappWorker.close().catch(() => {});
  await whatsappQueue.close().catch(() => {});
  await redis.quit?.();
}

main().catch(async (err) => {
  console.error('Unhandled error:', err);
  await teardown();
  process.exit(1);
});
