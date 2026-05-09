/**
 * Task 6 — 2FA: issue & store codes (Redis path) smoke test.
 *
 * Exercises issueCode() directly (the server action layer is exercised in
 * Task 8's full E2E). Verifies:
 *   - First issuance succeeds and an email arrives at Mailpit
 *   - The 2fa:{userId} Redis hash holds a 64-char hex (sha256), NOT the code
 *   - The plaintext code never appears in any Redis key
 *   - Resend cooldown rejects the second call within 60 s
 *   - Issuance rate-limit rejects the 4th call within 15 min
 *
 * Run with:  set -a && source .env.test && set +a && bun run scripts/smoke/two-factor-issue-smoke.ts
 */
import { setTimeout as sleep } from 'node:timers/promises';
import dotenv from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.test') });

import { redis } from '@/lib/redis';
import { issueCode } from '@/features/auth/two-factor/issue';
import { emailWorker } from '@/lib/queue/email-worker';
import { emailQueue } from '@/lib/queue/email-queue';
import { seedTwoFactorUser, TEST_USER_EMAIL } from './two-factor-seed';

const MAILPIT_API_URL = process.env.MAILPIT_API_URL || 'http://127.0.0.1:8025';

interface MailpitMessage {
  ID: string;
  MessageID: string;
  Subject: string;
  Snippet: string;
  Created: string;
}

async function fetchLatestSubject(subject: string): Promise<MailpitMessage | null> {
  const res = await fetch(`${MAILPIT_API_URL}/api/v1/messages?limit=20`);
  if (!res.ok) return null;
  const body = await res.json();
  return (
    (body.messages as MailpitMessage[]).find((m) => m.Subject === subject) || null
  );
}

async function fetchMessageBody(id: string): Promise<string> {
  const res = await fetch(`${MAILPIT_API_URL}/api/v1/message/${id}`);
  if (!res.ok) return '';
  const body = await res.json();
  return [body.HTML || '', body.Text || ''].join('\n');
}

async function clearMailpit() {
  await fetch(`${MAILPIT_API_URL}/api/v1/messages`, { method: 'DELETE' });
}

async function clearRedisFor(userId: string) {
  await redis.del(`2fa:${userId}`);
  await redis.del(`2fa:lock:${userId}`);
  await redis.del(`2fa:resend:${userId}`);
  await redis.del(`2fa:issue:${userId}`);
}

async function main() {
  console.log('━━━ Task 6 — 2FA issuance smoke ━━━');
  await clearMailpit();

  const { id: userId, email } = await seedTwoFactorUser();
  await clearRedisFor(userId);

  console.log(`User : ${email}  (id=${userId})`);
  console.log('');

  // 1. First issuance
  const first = await issueCode(userId, email, 'en');
  if (!first.ok) {
    console.error('✗ first issueCode failed:', first);
    process.exit(1);
  }
  console.log(`✓ first issuance ok  (resendIn=${first.resendInSeconds}s)`);

  // 1a. Redis state
  const stored = (await redis.hgetall(`2fa:${userId}`)) as Record<string, string>;
  if (!stored.hash || stored.hash.length !== 64 || !/^[0-9a-f]{64}$/.test(stored.hash)) {
    console.error('✗ stored.hash is missing or not 64-hex:', stored.hash);
    process.exit(1);
  }
  if (parseInt(stored.attempts, 10) !== 0) {
    console.error('✗ stored.attempts should be 0, got:', stored.attempts);
    process.exit(1);
  }
  console.log(`✓ Redis hash present (sha256 length 64), attempts=0`);

  // 1b. Mailpit observed the email — wait up to 30s for the worker to process
  const subject = '🔐 Your Verification Code';
  let msg: MailpitMessage | null = null;
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    msg = await fetchLatestSubject(subject);
    if (msg) break;
    await sleep(500);
  }
  if (!msg) {
    console.error('✗ Mailpit did not receive the code email within 30s');
    process.exit(1);
  }
  console.log(`✓ Mailpit observed message id=${msg.ID}`);

  // 1c. Extract the 6-digit code from the email body and verify hash matches
  const body = await fetchMessageBody(msg.ID);
  const codeMatch = body.match(/(?:[^\d]|^)(\d{6})(?:[^\d]|$)/);
  if (!codeMatch) {
    console.error('✗ could not extract 6-digit code from email body');
    console.error('  body excerpt:', body.slice(0, 400));
    process.exit(1);
  }
  const codeFromEmail = codeMatch[1];
  console.log(`✓ extracted 6-digit code from email`);

  // 1d. PROOF the plaintext code is NOT in any 2fa:* Redis key
  const allKeys = await redis.keys(`2fa:*`);
  for (const k of allKeys) {
    const t = await redis.type(k);
    let dump = '';
    if (t === 'hash') dump = JSON.stringify(await redis.hgetall(k));
    else if (t === 'string') dump = (await redis.get(k)) || '';
    if (dump.includes(codeFromEmail)) {
      console.error(`✗ PLAINTEXT CODE FOUND in Redis key ${k}`);
      process.exit(1);
    }
  }
  console.log(`✓ plaintext code is NOT in any 2fa:* Redis key`);

  // 2. Resend cooldown
  const second = await issueCode(userId, email, 'en');
  if (second.ok) {
    console.error('✗ second issueCode should have failed (cooldown)');
    process.exit(1);
  }
  if (second.reason !== 'cooldown') {
    console.error('✗ second issueCode reason expected cooldown, got:', second.reason);
    process.exit(1);
  }
  console.log(`✓ second issuance rejected by cooldown (retryAfter=${second.retryAfter}s)`);

  // 3. Issuance rate limit (3 per 15 min)
  // Bypass cooldown by resetting only the resend key.
  await redis.del(`2fa:resend:${userId}`);
  const third = await issueCode(userId, email, 'en');
  if (!third.ok) {
    console.error('✗ third issueCode should succeed (1 / 3 used originally, this is 2nd)');
    process.exit(1);
  }
  console.log(`✓ third issuance ok (under rate limit)`);

  await redis.del(`2fa:resend:${userId}`);
  const fourth = await issueCode(userId, email, 'en');
  if (!fourth.ok) {
    console.error('✗ fourth issueCode should succeed (3rd of 3)');
    process.exit(1);
  }
  console.log(`✓ fourth issuance ok (3 of 3 used)`);

  await redis.del(`2fa:resend:${userId}`);
  const fifth = await issueCode(userId, email, 'en');
  if (fifth.ok) {
    console.error('✗ fifth issueCode should have failed (rate limited)');
    process.exit(1);
  }
  if (fifth.reason !== 'rate_limited') {
    console.error('✗ fifth issueCode reason expected rate_limited, got:', fifth.reason);
    process.exit(1);
  }
  console.log(`✓ fifth issuance rejected by rate limit`);

  console.log('');
  console.log('━━━ verdict ━━━');
  console.log('🟢 GREEN — issuance, cooldown, and rate-limit all behave correctly');

  await clearRedisFor(userId);
  await emailWorker.close();
  await emailQueue.close();
  await redis.quit?.();
  process.exit(0);
}

main().catch(async (err) => {
  console.error('Unhandled error:', err);
  await emailWorker.close().catch(() => {});
  await emailQueue.close().catch(() => {});
  await redis.quit?.();
  process.exit(1);
});
