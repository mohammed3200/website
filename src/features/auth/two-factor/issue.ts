/**
 * 2FA issuance — generates a new 6-digit code, persists the hash to Redis,
 * and enqueues the email via the existing email queue.
 *
 * The PLAIN code is returned ONLY to the email job payload — never to a
 * caller, never logged, never persisted in the DB.
 */
import crypto from 'node:crypto';
import { db } from '@/lib/db';
import {
  putCode,
  resendCooldownRemaining,
  issuanceWithinLimit,
  isLocked,
  TwoFactorConstants,
} from './store';
import { build2FAEmailPayload, enqueue2FAEmail } from './email';

export type IssueResult =
  | { ok: true; resendInSeconds: number }
  | { ok: false; reason: 'locked' | 'cooldown' | 'rate_limited' | 'unknown_user' | 'send_failed'; retryAfter?: number };

/**
 * Generate a 6-digit code, store its hash, and enqueue the email.
 * Idempotency: the most recent issuance overwrites any prior code for this user.
 */
export async function issueCode(
  userId: string,
  email: string,
  locale: 'ar' | 'en' = 'en',
): Promise<IssueResult> {
  // 1. Lockout check
  if (await isLocked(userId)) {
    return { ok: false, reason: 'locked', retryAfter: TwoFactorConstants.LOCK_TTL };
  }

  // 2. Resend cooldown check
  const cooldown = await resendCooldownRemaining(userId);
  if (cooldown > 0) {
    return { ok: false, reason: 'cooldown', retryAfter: cooldown };
  }

  // 3. Issuance rate-limit (3 / 15 min)
  if (!(await issuanceWithinLimit(userId))) {
    return { ok: false, reason: 'rate_limited', retryAfter: TwoFactorConstants.ISSUE_WINDOW_TTL };
  }

  // 4. Verify the user exists and resolve display name
  const user = await db.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
  if (!user || !user.email) {
    return { ok: false, reason: 'unknown_user' };
  }

  // 5. Generate code (cryptographically secure, 6 digits, no leading-zero bias)
  const rawCode = generateCode();

  // 6. Persist hash + cooldown
  await putCode(userId, rawCode, user.email, locale);

  // 7. Enqueue email
  const payload = build2FAEmailPayload(user.name || user.email.split('@')[0], user.email, rawCode, locale);
  const queued = await enqueue2FAEmail(payload);
  if (!queued.ok) {
    return { ok: false, reason: 'send_failed' };
  }

  return { ok: true, resendInSeconds: TwoFactorConstants.RESEND_TTL };
}

function generateCode(): string {
  // crypto.randomInt is uniform over [min, max)
  const n = crypto.randomInt(0, 1_000_000);
  return n.toString().padStart(6, '0');
}
