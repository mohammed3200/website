'use server';

import { issueCode } from '@/features/auth/two-factor/issue';
import { readPendingCookie } from '@/features/auth/two-factor/pending-cookie';

export const resendTwoFactor = async (): Promise<
  { success: string } | { error: string; retryAfter?: number }
> => {
  const pending = await readPendingCookie();
  if (!pending) {
    return { error: 'Verification session expired. Please sign in again.' };
  }

  const issued = await issueCode(pending.userId, pending.email, pending.locale);
  if (!issued.ok) {
    switch (issued.reason) {
      case 'locked':
        return {
          error: 'Account temporarily locked. Please try again later.',
          retryAfter: issued.retryAfter,
        };
      case 'cooldown':
        return {
          error: `Please wait ${issued.retryAfter}s before requesting another code.`,
          retryAfter: issued.retryAfter,
        };
      case 'rate_limited':
        return {
          error: 'Too many code requests. Please try again later.',
          retryAfter: issued.retryAfter,
        };
      case 'unknown_user':
        return { error: 'Invalid operation.' };
      case 'send_failed':
        return { error: 'Failed to send the verification code. Please try again.' };
    }
  }

  return { success: 'New code sent to your email!' };
};
