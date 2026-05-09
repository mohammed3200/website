/**
 * POST /api/auth/resend-2fa
 *
 * Reads the pending cookie and re-issues the code via issueCode().
 * Honors the resend cooldown (60 s) and per-window issuance limit (3 / 15 min).
 */
import { NextResponse } from 'next/server';
import { issueCode } from '@/features/auth/two-factor/issue';
import { readPendingCookie } from '@/features/auth/two-factor/pending-cookie';

export async function POST() {
  const pending = await readPendingCookie();
  if (!pending) {
    return NextResponse.json(
      { error: 'Verification session expired. Please sign in again.' },
      { status: 410 },
    );
  }

  const issued = await issueCode(pending.userId, pending.email, pending.locale);
  if (!issued.ok) {
    const isThrottle = ['cooldown', 'rate_limited', 'locked'].includes(issued.reason as string);
    const status = isThrottle ? 429 : 400;
    return NextResponse.json(
      { error: issued.reason, retryAfter: issued.retryAfter },
      { status },
    );
  }

  return NextResponse.json({ ok: true, resendInSeconds: issued.resendInSeconds });
}
