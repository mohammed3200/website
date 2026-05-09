/**
 * Task 13 smoke — verifies the queue-health fetcher returns real BullMQ
 * counts and EmailLog/WhatsAppLog totals (not mocks).
 *
 * Idempotent: read-only.
 */
import dotenv from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.test') });



async function main() {
  const { getEmailQueueHealth } = await import('../../src/features/admin/queries/queue-health');

  console.log('━━━ Task 13 — dashboard queue-health fetcher smoke ━━━');
  const t0 = Date.now();
  const data = await getEmailQueueHealth();
  console.log(`fetch took ${Date.now() - t0} ms`);
  console.log('email   :', data.email);
  console.log('whatsapp:', data.whatsapp);

  const checks = {
    'email.queue is "email"': data.email.queue === 'email',
    'email has counts (numbers)': typeof data.email.waiting === 'number',
    'email has 24h block': typeof data.email.last24h?.sent === 'number',
    'whatsapp.queue is "whatsapp"': data.whatsapp.queue === 'whatsapp',
    'whatsapp has counts': typeof data.whatsapp.waiting === 'number',
    'whatsapp has 24h block': typeof data.whatsapp.last24h?.sent === 'number',
    'mock=false because REDIS_URL is set': data.email.mock === false && data.whatsapp.mock === false,
  };

  let pass = 0, fail = 0;
  for (const [k, v] of Object.entries(checks)) {
    if (v) { pass++; console.log(`  ✓ ${k}`); }
    else { fail++; console.error(`  ✗ ${k}`); }
  }

  console.log('');
  console.log('━━━ verdict ━━━');
  console.log(fail === 0 ? '🟢 GREEN — queue-health fetcher returns real DB+queue data' : '🔴 RED');

  // Force-exit even if Redis connections are still pending (relevant when
  // testing the Redis-down path).
  setTimeout(() => process.exit(fail === 0 ? 0 : 1), 100);
}

main().catch(async (err) => {
  console.error('Unhandled:', err);
  const { redis } = await import('../../src/lib/redis');
  await redis.quit?.();
  process.exit(1);
});
