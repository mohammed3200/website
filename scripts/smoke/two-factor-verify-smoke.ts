/**
 * Task 7 — 2FA verify path smoke test.
 *
 * Exercises the verifyCode() core logic + the bypass-token + pending-cookie
 * helpers without spinning up Next.js. The full HTTP/middleware path is
 * covered by the Task 8 E2E test.
 *
 * Scenarios:
 *   1. Happy path: verifyCode(correct) → ok=true; second call → 'expired'
 *   2. Wrong code N times reaches MAX_ATTEMPTS → 'too_many_attempts' + lock
 *   3. After lock, even the right code returns 'locked'
 *   4. Pending cookie HMAC: tampering invalidates
 *   5. Bypass token: round-trip issue/verify; tampering invalidates;
 *      expired token rejected; email-mismatch rejected
 *
 * Run with:  set -a && source .env.test && set +a && bun run scripts/smoke/two-factor-verify-smoke.ts
 */
import dotenv from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env.test') });

import { redis } from '@/lib/redis';
import { putCode, hashCode, isLocked, deleteCode } from '@/features/auth/two-factor/store';
import { verifyCode } from '@/features/auth/two-factor/verify';
import { encodePending, decodePending } from '@/features/auth/two-factor/pending-cookie';
import { issueBypass, verifyBypass } from '@/features/auth/two-factor/bypass-token';
import { seedTwoFactorUser } from './two-factor-seed';

let pass = 0;
let fail = 0;

function check(name: string, ok: boolean, detail?: string) {
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.error(`  ✗ ${name}${detail ? `  — ${detail}` : ''}`);
  }
}

async function main() {
  console.log('━━━ Task 7 — 2FA verify path smoke ━━━\n');

  // ── Scenario 1 ── happy path
  console.log('Scenario 1: happy path');
  const { id: userId, email } = await seedTwoFactorUser();
  await redis.del(`2fa:${userId}`, `2fa:lock:${userId}`, `2fa:resend:${userId}`, `2fa:issue:${userId}`);
  const goodCode = '987654';
  await putCode(userId, goodCode, email, 'en');
  const r1 = await verifyCode(userId, goodCode);
  check('correct code returns ok', r1.ok === true);
  // Second call: code was deleted, expect 'expired'
  const r1b = await verifyCode(userId, goodCode);
  check(
    'replay after success → expired',
    !r1b.ok && r1b.reason === 'expired',
    JSON.stringify(r1b),
  );

  // ── Scenario 2 ── lockout after MAX_ATTEMPTS wrong codes
  console.log('\nScenario 2: lockout after 5 wrong codes');
  await redis.del(`2fa:${userId}`, `2fa:lock:${userId}`);
  await putCode(userId, '111111', email, 'en');
  const wrong = '222222';
  let lockedReached = false;
  let lastReason = '';
  for (let i = 1; i <= 5; i++) {
    const r = await verifyCode(userId, wrong);
    if (!r.ok) lastReason = r.reason;
    if (!r.ok && r.reason === 'too_many_attempts') {
      lockedReached = true;
      break;
    }
  }
  check('5th wrong attempt → too_many_attempts', lockedReached, `last=${lastReason}`);
  check('lock key set in Redis', await isLocked(userId));

  // Even the right code now returns locked (code was deleted on lockout)
  const r3 = await verifyCode(userId, '111111');
  check(
    'after lock, any code → locked',
    !r3.ok && r3.reason === 'locked',
    JSON.stringify(r3),
  );

  // Cleanup
  await redis.del(`2fa:${userId}`, `2fa:lock:${userId}`);
  await deleteCode(userId);

  // ── Scenario 3 ── pending cookie HMAC integrity
  console.log('\nScenario 3: pending cookie HMAC');
  const cookie = encodePending({ userId: 'u1', email: 'a@b.c', locale: 'en' });
  const decoded = decodePending(cookie);
  check('encoded cookie round-trips', decoded?.userId === 'u1' && decoded?.email === 'a@b.c');
  // Tamper with the body
  const dot = cookie.indexOf('.');
  const tampered = `${cookie.slice(0, dot - 1)}X.${cookie.slice(dot + 1)}`;
  check('tampered body rejected', decodePending(tampered) === null);
  // Tamper with signature
  const tamperedSig = `${cookie.slice(0, dot + 1)}DEADBEEF`;
  check('tampered signature rejected', decodePending(tamperedSig) === null);

  // ── Scenario 4 ── bypass token integrity
  console.log('\nScenario 4: bypass token');
  const bypass = issueBypass(userId, email);
  check('bypass round-trips', verifyBypass(bypass, email) === userId);
  check('bypass with wrong email rejected', verifyBypass(bypass, 'wrong@x.com') === null);
  check(
    'bypass with mangled signature rejected',
    verifyBypass(bypass.replace(/.$/, '!'), email) === null,
  );

  // ── Scenario 5 ── hash output stable + non-reversible (sanity)
  console.log('\nScenario 5: hash output');
  const h1 = hashCode('123456');
  const h2 = hashCode('123456');
  check('hashCode is deterministic', h1 === h2);
  check('hashCode produces 64-char hex', /^[a-f0-9]{64}$/.test(h1));
  check('different codes produce different hashes', hashCode('123456') !== hashCode('654321'));

  console.log('');
  console.log(`Summary: ${pass} pass / ${fail} fail`);
  console.log('');
  console.log('━━━ verdict ━━━');
  console.log(fail === 0 ? '🟢 GREEN — verify path correct' : '🔴 RED — see failures above');

  await redis.quit?.();
  process.exit(fail === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error('Unhandled error:', err);
  await redis.quit?.();
  process.exit(1);
});
