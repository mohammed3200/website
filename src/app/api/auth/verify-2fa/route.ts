/**
 * POST /api/auth/verify-2fa
 *
 * Body: { code: string }
 * Reads the eitdc_2fa_pending cookie set by the login server action.
 * On success, mints a 30-second bypass token, clears the pending cookie,
 * and instructs the client to call signIn('credentials', { email, tfaBypass })
 * to issue the NextAuth session cookie.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyCode } from '@/features/auth/two-factor/verify';
import { issueBypass } from '@/features/auth/two-factor/bypass-token';
import {
  readPendingCookie,
  clearPendingCookie,
} from '@/features/auth/two-factor/pending-cookie';

const BodySchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Code must be 6 digits'),
});

export async function POST(req: NextRequest) {
  let body: { code: string };
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const pending = await readPendingCookie();
  if (!pending) {
    return NextResponse.json(
      { error: 'Verification session expired. Please sign in again.' },
      { status: 410 },
    );
  }

  const result = await verifyCode(pending.userId, body.code);
  if (!result.ok) {
    switch (result.reason) {
      case 'locked':
        return NextResponse.json(
          { error: 'Too many failed attempts. Account temporarily locked.' },
          { status: 429 },
        );
      case 'expired':
        await clearPendingCookie();
        return NextResponse.json(
          { error: 'Code expired. Please sign in again.' },
          { status: 410 },
        );
      case 'too_many_attempts':
        await clearPendingCookie();
        return NextResponse.json(
          { error: 'Too many failed attempts. Account temporarily locked.' },
          { status: 429 },
        );
      case 'invalid':
        return NextResponse.json(
          {
            error: 'Invalid code',
            remainingAttempts: result.remainingAttempts ?? 0,
          },
          { status: 401 },
        );
      default:
        return NextResponse.json(
          { error: 'An unexpected error occurred during verification.' },
          { status: 500 },
        );
    }
  }

  // Mint a 30s bypass token and clear the pending cookie.
  const bypass = issueBypass(pending.userId, pending.email);
  await clearPendingCookie();

  return NextResponse.json({
    ok: true,
    email: pending.email,
    tfaBypass: bypass,
  });
}
