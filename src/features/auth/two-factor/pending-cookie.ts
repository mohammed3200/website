/**
 * "Pending 2FA" cookie helpers.
 *
 * When the credentials login succeeds but 2FA is required, we set a short-lived
 * signed cookie holding { userId, email, locale } and redirect the user to
 * /auth/verify. The full NextAuth session cookie is only issued AFTER the
 * 2FA code is verified.
 *
 * The cookie is HMAC-signed with NEXTAUTH_SECRET to prevent tampering.
 * It is httpOnly, sameSite=lax, and TTL = TWO_FACTOR_CODE_TTL_SECONDS so the
 * user has the same window as the code itself.
 */
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { TwoFactorConstants } from './store';

export const PENDING_COOKIE_NAME = 'eitdc_2fa_pending';

export interface PendingPayload {
  userId: string;
  email: string;
  locale: 'ar' | 'en';
  /** Set at issuance — used to expire client-side. */
  iat: number;
  /** Random nonce so two issuances don't yield the same cookie value. */
  nonce: string;
}

function secret(): string {
  return process.env.NEXTAUTH_SECRET || '';
}

function sign(payload: string): string {
  return crypto
    .createHmac('sha256', secret())
    .update(payload)
    .digest('base64url');
}

export function encodePending(payload: Omit<PendingPayload, 'iat' | 'nonce'>): string {
  const full: PendingPayload = {
    ...payload,
    iat: Date.now(),
    nonce: crypto.randomBytes(8).toString('base64url'),
  };
  const body = Buffer.from(JSON.stringify(full)).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function decodePending(token: string | undefined | null): PendingPayload | null {
  if (!token || typeof token !== 'string') return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as PendingPayload;
    if (Date.now() - payload.iat > TwoFactorConstants.CODE_TTL * 1000) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function setPendingCookie(payload: Omit<PendingPayload, 'iat' | 'nonce'>) {
  const jar = await cookies();
  jar.set(PENDING_COOKIE_NAME, encodePending(payload), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TwoFactorConstants.CODE_TTL,
  });
}

export async function readPendingCookie(): Promise<PendingPayload | null> {
  const jar = await cookies();
  const c = jar.get(PENDING_COOKIE_NAME);
  return decodePending(c?.value || null);
}

export async function clearPendingCookie() {
  const jar = await cookies();
  jar.delete(PENDING_COOKIE_NAME);
}
