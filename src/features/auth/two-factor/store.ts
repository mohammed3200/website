/**
 * Redis-backed 2FA store.
 *
 * Keys:
 *   2fa:{userId}            HASH  { hash, attempts, sentAt, locale, email }    TTL = TWO_FACTOR_CODE_TTL_SECONDS
 *   2fa:lock:{userId}       STRING '1'                                          TTL = 900s (15 min)
 *   2fa:resend:{userId}     STRING '1'                                          TTL = TWO_FACTOR_RESEND_COOLDOWN_SECONDS
 *   2fa:issue:{userId}      STRING <count>                                      TTL = 900s (cap on issuances per 15 min)
 *
 * Codes are stored as sha256(EMAIL_TOKEN_SECRET || code) — never as plain text.
 */
import crypto from 'node:crypto';
import { redis } from '@/lib/redis';

const CODE_TTL = parseInt(
  process.env.TWO_FACTOR_CODE_TTL_SECONDS || '600',
  10,
);
const LOCK_TTL = 15 * 60;
const RESEND_TTL = parseInt(
  process.env.TWO_FACTOR_RESEND_COOLDOWN_SECONDS || '60',
  10,
);
const ISSUE_WINDOW_TTL = 15 * 60;
const MAX_ISSUANCES_PER_WINDOW = 3;

function pepper(): string {
  return process.env.EMAIL_TOKEN_SECRET || process.env.NEXTAUTH_SECRET || '';
}

export function hashCode(code: string): string {
  return crypto
    .createHmac('sha256', pepper())
    .update(code)
    .digest('hex');
}

export interface CodeRecord {
  hash: string;
  attempts: number;
  sentAt: number;
  locale: 'ar' | 'en';
  email: string;
}

const codeKey = (userId: string) => `2fa:${userId}`;
const lockKey = (userId: string) => `2fa:lock:${userId}`;
const resendKey = (userId: string) => `2fa:resend:${userId}`;
const issueKey = (userId: string) => `2fa:issue:${userId}`;

/**
 * Store a freshly-issued code (overwrites any existing one for this user).
 */
export async function putCode(
  userId: string,
  rawCode: string,
  email: string,
  locale: 'ar' | 'en',
): Promise<void> {
  const pipeline = redis.multi();
  const key = codeKey(userId);
  pipeline.del(key);
  pipeline.hset(key, {
    hash: hashCode(rawCode),
    attempts: '0',
    sentAt: Date.now().toString(),
    locale,
    email,
  });
  pipeline.expire(key, CODE_TTL);

  // Resend cooldown
  pipeline.set(resendKey(userId), '1', 'EX', RESEND_TTL);

  // Issuance window counter
  pipeline.incr(issueKey(userId));
  pipeline.expire(issueKey(userId), ISSUE_WINDOW_TTL);

  await pipeline.exec();
}

/**
 * Read the current code record (or null if expired/absent).
 */
export async function readCode(userId: string): Promise<CodeRecord | null> {
  const raw = await redis.hgetall(codeKey(userId));
  if (!raw || !raw.hash) return null;
  return {
    hash: raw.hash,
    attempts: parseInt(raw.attempts || '0', 10),
    sentAt: parseInt(raw.sentAt || '0', 10),
    locale: (raw.locale as 'ar' | 'en') || 'en',
    email: raw.email,
  };
}

/**
 * Increment the attempt counter; returns new count.
 */
export async function recordAttempt(userId: string): Promise<number> {
  const value = await redis.hincrby(codeKey(userId), 'attempts', 1);
  return value;
}

/**
 * Delete the code record (on success or final lockout).
 */
export async function deleteCode(userId: string): Promise<void> {
  await redis.del(codeKey(userId));
}

/**
 * Lock helpers.
 */
export async function isLocked(userId: string): Promise<boolean> {
  const v = await redis.get(lockKey(userId));
  return v === '1';
}

export async function lock(userId: string): Promise<void> {
  await redis.set(lockKey(userId), '1', 'EX', LOCK_TTL);
}

export async function unlock(userId: string): Promise<void> {
  await redis.del(lockKey(userId));
}

/**
 * Resend cooldown helpers.
 */
export async function resendCooldownRemaining(
  userId: string,
): Promise<number> {
  const ttl = await redis.ttl(resendKey(userId));
  return ttl > 0 ? ttl : 0;
}

/**
 * Issuance rate-limit (max 3 per 15 min).
 */
export async function issuanceWithinLimit(userId: string): Promise<boolean> {
  const v = await redis.get(issueKey(userId));
  const count = v ? parseInt(v, 10) : 0;
  return count < MAX_ISSUANCES_PER_WINDOW;
}

export const TwoFactorConstants = {
  CODE_TTL,
  LOCK_TTL,
  RESEND_TTL,
  ISSUE_WINDOW_TTL,
  MAX_ISSUANCES_PER_WINDOW,
  MAX_ATTEMPTS: parseInt(process.env.TWO_FACTOR_MAX_ATTEMPTS || '5', 10),
};
