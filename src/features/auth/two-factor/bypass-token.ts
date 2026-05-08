/**
 * Two-factor bypass token.
 *
 * Issued AFTER /api/auth/verify-2fa accepts a valid code. The token is then
 * passed to NextAuth's credentials provider in lieu of a password — the
 * provider validates the signature, rejects on any tampering, and returns
 * the user.
 *
 * Format:  base64url( JSON({ userId, email, iat, nonce }) ).hmac
 *
 * Lifetime: 30 seconds (just enough to make the verify -> signIn round-trip).
 */
import crypto from 'node:crypto';

const BYPASS_TTL_MS = 30_000;

interface BypassPayload {
  userId: string;
  email: string;
  iat: number;
  nonce: string;
}

function secret(): string {
  return process.env.NEXTAUTH_SECRET || '';
}

function hmac(input: string): string {
  return crypto.createHmac('sha256', secret()).update(input).digest('base64url');
}

export function issueBypass(userId: string, email: string): string {
  const payload: BypassPayload = {
    userId,
    email,
    iat: Date.now(),
    nonce: crypto.randomBytes(8).toString('base64url'),
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${hmac(body)}`;
}

/**
 * Returns the userId if the token is valid, otherwise null.
 * Email is checked to bind the token to the same identity that started the flow.
 */
export function verifyBypass(token: string, email: string): string | null {
  if (!token || typeof token !== 'string') return null;
  const dot = token.indexOf('.');
  if (dot < 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = hmac(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!crypto.timingSafeEqual(a, b)) return null;

  let payload: BypassPayload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as BypassPayload;
  } catch {
    return null;
  }

  if (Date.now() - payload.iat > BYPASS_TTL_MS) return null;
  if (payload.email.toLowerCase() !== email.toLowerCase()) return null;
  return payload.userId;
}
