/**
 * Task 4 — Email queue health (BullMQ end-to-end)
 *
 * Proves the queue path:
 *   enqueue -> worker picks up -> transport sends -> Mailpit observes
 *
 * Independent from Task 2 (which bypassed the queue).
 *
 * Run with:   bun run scripts/smoke/email-queue-smoke.ts
 *
 * The script imports the EXISTING emailQueue + emailWorker (no fork).
 * It instruments the worker's `completed` event so the test resolves
 * exactly when the job lifecycle finishes.
 */
import { setTimeout as sleep } from 'node:timers/promises';
import dotenv from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.test') });

let emailQueue: any;
let emailWorker: any;

const MAILPIT_API_URL =
  process.env.MAILPIT_API_URL || 'http://127.0.0.1:8025';
const POLL_MS = 250;
const ENQUEUE_DEADLINE = 60_000;
const INBOX_DEADLINE = 60_000;

interface MailpitMessageSummary {
  ID: string;
  MessageID: string;
  Subject: string;
}

async function findInMailpitBySubject(
  subject: string,
): Promise<MailpitMessageSummary | null> {
  const res = await fetch(`${MAILPIT_API_URL}/api/v1/messages?limit=50`);
  if (!res.ok) return null;
  const body = await res.json();
  return (
    (body.messages as MailpitMessageSummary[]).find((m) => m.Subject === subject) ||
    null
  );
}

async function main() {
  const qMod = await import('../../src/lib/queue/email-queue');
  const wMod = await import('../../src/lib/queue/email-worker');
  emailQueue = qMod.emailQueue;
  emailWorker = wMod.emailWorker;

  const inbox = process.env.SMOKE_TEST_INBOX;
  if (!inbox) {
    console.error('❌ SMOKE_TEST_INBOX is required.');
    process.exit(2);
  }

  const ts = new Date().toISOString();
  const subject = `[EITDC QUEUE] ${ts}`;

  console.log('━━━ Task 4 — Email queue health ━━━');
  console.log(`Queue   : ${emailQueue.name}`);
  console.log(`Worker  : ${emailWorker.name}`);
  console.log(`To      : ${inbox}`);
  console.log(`Subject : ${subject}`);
  console.log('');

  // Listen for the job lifecycle
  const lifecycle: { stage: string; at: number }[] = [];
  const enqueuedAt = Date.now();
  let startedAt = 0;
  let completedAt = 0;
  let inboxAt = 0;

  emailWorker.on('active', (job: any) => {
    if (job?.data?.subject === subject) {
      startedAt = Date.now();
      lifecycle.push({ stage: 'active', at: startedAt });
    }
  });

  const completionPromise = new Promise<void>((res, rej) => {
    emailWorker.on('completed', (job: any) => {
      if (job?.data?.subject === subject) {
        completedAt = Date.now();
        lifecycle.push({ stage: 'completed', at: completedAt });
        res();
      }
    });
    emailWorker.on('failed', (job: any, err: any) => {
      if (job?.data?.subject === subject) {
        rej(new Error(`Job failed: ${err.message}`));
      }
    });
    setTimeout(() => rej(new Error('worker did not complete in 60s')), ENQUEUE_DEADLINE);
  });

  // Enqueue
  const job = await emailQueue.add('send-email', {
    to: inbox,
    subject,
    text: 'queue smoke',
    html: `<p dir="auto">queue smoke at ${ts}</p>`,
  });
  console.log(`✓ enqueued job id=${job.id}`);

  // Wait for worker
  try {
    await completionPromise;
    console.log('✓ worker completed the job');
  } catch (err) {
    console.error(`✗ ${err instanceof Error ? err.message : err}`);
    await teardown();
    process.exit(1);
  }

  // Poll Mailpit for the message
  const inboxDeadline = Date.now() + INBOX_DEADLINE;
  let found: MailpitMessageSummary | null = null;
  while (Date.now() < inboxDeadline) {
    found = await findInMailpitBySubject(subject);
    if (found) {
      inboxAt = Date.now();
      break;
    }
    await sleep(POLL_MS);
  }

  if (!found) {
    console.error(`✗ Inbox did not receive the message in ${INBOX_DEADLINE / 1000}s`);
    await teardown();
    process.exit(1);
  }

  console.log(`✓ Mailpit observed message id=${found.ID}`);
  console.log('');
  console.log('Timing:');
  console.log(`  enqueued -> active     ${(startedAt - enqueuedAt).toString().padStart(6)} ms`);
  console.log(`  active   -> completed  ${(completedAt - startedAt).toString().padStart(6)} ms`);
  console.log(`  completed -> inbox     ${(inboxAt - completedAt).toString().padStart(6)} ms`);
  console.log(`  enqueued -> inbox      ${(inboxAt - enqueuedAt).toString().padStart(6)} ms`);
  console.log('');

  // Health metrics on the queue
  const counts = await emailQueue.getJobCounts(
    'waiting',
    'active',
    'completed',
    'failed',
    'delayed',
  );
  console.log('Queue counts:', counts);

  const failed = await emailQueue.getJobs(['failed'], 0, -1);
  const currentRunFailures = failed.filter((f: any) => f?.data?.subject === subject);

  if (currentRunFailures.length > 0) {
    console.log('Recent failures (current run):');
    for (const f of currentRunFailures)
      console.log(
        `  - id=${f.id} reason=${(f as unknown as { failedReason: string }).failedReason || 'n/a'}`,
      );
  } else {
    console.log('Recent failures (current run): none');
  }

  // AC checks
  const checks = {
    queued: !!job.id,
    activeWithin10s: startedAt - enqueuedAt <= 10_000,
    completedWithin30s: completedAt - startedAt <= 30_000,
    inboxWithin60s: inboxAt - enqueuedAt <= 60_000,
    noFailedJobs: currentRunFailures.length === 0,
  };

  for (const [k, v] of Object.entries(checks))
    console.log(`${v ? '✓' : '✗'} ${k}`);

  const allOk = Object.values(checks).every(Boolean);
  console.log('');
  console.log('━━━ verdict ━━━');
  console.log(
    allOk
      ? '🟢 GREEN — queue path healthy'
      : '🔴 RED — at least one timing assertion failed',
  );

  await teardown();
  process.exit(allOk ? 0 : 1);
}

async function teardown() {
  if (emailWorker) await emailWorker.close();
  if (emailQueue) await emailQueue.close();
}

main().catch(async (err) => {
  console.error('Unhandled error:', err);
  await teardown();
  process.exit(1);
});
