'use server';

import { z } from 'zod';
import { signIn } from '@/features/auth/auth';
import { LoginSchema } from '@/features/auth/schemas';
import { getUserByEmail } from '@/data/user';
import { generateVerificationToken } from '@/lib/tokens';
import { emailService } from '@/lib/email/service';
import { issueCode } from '@/features/auth/two-factor/issue';
import { setPendingCookie } from '@/features/auth/two-factor/pending-cookie';
import { comparePassword } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { rateLimit } from '@/lib/rate-limit';

export type LoginActionResult =
  | { success: string }
  | { error: string }
  | { twoFactor: true; cooldownSeconds: number };

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null,
  locale: 'ar' | 'en' = 'en',
): Promise<LoginActionResult> => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password } = validatedFields.data;

  // Brute-force throttle on the email itself (independent of 2FA's own counters)
  const limiter = await rateLimit(`login:${email}`, 5, 900); // 5 attempts / 15 min
  if (!limiter.success) {
    return { error: 'Too many login attempts. Please try again in 15 minutes.' };
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email does not exist!' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ebic.cit.edu.ly';
    const verificationLink = `${baseUrl}/auth/new-verification?token=${verificationToken.token}`;
    const userName = existingUser.name || existingUser.email.split('@')[0];

    const result = await emailService.sendEmailVerification(
      { name: userName, email: verificationToken.email, verificationLink },
      locale,
      '24 hours',
    );

    if (!result.success) {
      return { error: 'Failed to send verification email!' };
    }

    return { success: 'Confirmation email sent!' };
  }

  // Validate the password BEFORE issuing the 2FA code so we never email a
  // code to someone who can't authenticate. We do not call signIn() yet —
  // that happens after /api/auth/verify-2fa accepts the code.
  const passwordsMatch = await comparePassword(password, existingUser.password);
  if (!passwordsMatch) {
    return { error: 'Invalid credentials!' };
  }

  if (existingUser.isActive === false) {
    return { error: 'Your account has been deactivated. Please contact an administrator.' };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    const issued = await issueCode(existingUser.id, existingUser.email, locale);
    if (!issued.ok) {
      switch (issued.reason) {
        case 'locked':
          return { error: 'Account temporarily locked. Please try again in 15 minutes.' };
        case 'cooldown':
          return { error: `Please wait ${issued.retryAfter}s before requesting another code.` };
        case 'rate_limited':
          return { error: 'Too many code requests. Please try again later.' };
        case 'send_failed':
          return { error: 'Failed to send the verification code. Please try again.' };
        default:
          return { error: 'Could not issue verification code.' };
      }
    }

    await setPendingCookie({
      userId: existingUser.id,
      email: existingUser.email,
      locale,
    });

    return { twoFactor: true, cooldownSeconds: issued.resendInSeconds };
  }

  // No 2FA configured for this user — issue the session directly.
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
    // signIn redirects, so this return is unreachable in practice.
    return { success: 'Signed in.' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Something went wrong!' };
      }
    }

    throw error;
  }
};
