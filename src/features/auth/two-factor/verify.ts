/**
 * 2FA verification — constant-time compare, attempt counter, lockout.
 *
 * Calling code is responsible for promoting the session AFTER this returns
 * { ok: true } (we issue the NextAuth cookie via the credentials provider in
 * the verify-2fa API route).
 */
import crypto from 'node:crypto';
import { db } from '@/lib/db';
import {
  deleteCode,
  hashCode,
  isLocked,
  lock,
  readCode,
  recordAttempt,
  TwoFactorConstants,
} from './store';
import { sendLockoutAlert } from './email';

export type VerifyResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'locked' | 'expired' | 'invalid' | 'too_many_attempts';
      remainingAttempts?: number;
      retryAfter?: number;
    };

export async function verifyCode(
  userId: string,
  submittedCode: string,
): Promise<VerifyResult> {
  // 1. Locked?
  if (await isLocked(userId)) {
    return { ok: false, reason: 'locked', retryAfter: TwoFactorConstants.LOCK_TTL };
  }

  // 2. Read stored hash
  const stored = await readCode(userId);
  if (!stored) {
    return { ok: false, reason: 'expired' };
  }

  // 3. Constant-time compare
  const submittedHash = hashCode(submittedCode);
  const a = Buffer.from(submittedHash, 'hex');
  const b = Buffer.from(stored.hash, 'hex');
  let match = false;
  if (a.length === b.length) {
    match = crypto.timingSafeEqual(a, b);
  } else {
    // Still consume time even on length mismatch
    crypto.timingSafeEqual(a, a);
  }

  if (match) {
    await deleteCode(userId);
    return { ok: true };
  }

  // 4. Wrong code → bump attempt counter, lock if exceeded
  const attempts = await recordAttempt(userId);
  if (attempts >= TwoFactorConstants.MAX_ATTEMPTS) {
    await lock(userId);
    await deleteCode(userId);

    // Fire-and-forget security notice (don't await; don't fail the response)
    void (async () => {
      try {
        const user = await db.user.findUnique({
          where: { id: userId },
          select: { email: true, name: true },
        });
        if (user?.email) {
          await sendLockoutAlert(user.email, user.name || user.email, stored.locale);
        }
      } catch (e) {
        console.error('[2FA] failed to send lockout alert:', e);
      }
    })();

    return {
      ok: false,
      reason: 'too_many_attempts',
      retryAfter: TwoFactorConstants.LOCK_TTL,
    };
  }

  return {
    ok: false,
    reason: 'invalid',
    remainingAttempts: TwoFactorConstants.MAX_ATTEMPTS - attempts,
  };
}
