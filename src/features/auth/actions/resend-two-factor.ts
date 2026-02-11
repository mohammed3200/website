'use server';

import { generateTwoFactorToken } from '@/lib/tokens';
import { emailService } from '@/lib/email/service';
import { getUserByEmail } from '@/data/user';

export const resendTwoFactor = async (email: string) => {
    if (!email) {
        return { error: 'Email is required!' };
    }

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'Invalid operation!' };
    }

    if (!existingUser.isTwoFactorEnabled) {
        return { error: 'Two-factor authentication is not enabled for this account.' };
    }

    const twoFactorToken = await generateTwoFactorToken(existingUser.email);
    const userName = existingUser.name || existingUser.email.split('@')[0];

    const result = await emailService.send2FA(
        {
            name: userName,
            email: twoFactorToken.email,
            code: twoFactorToken.token,
        },
        'en', // Default locale
        '10 minutes',
    );

    if (!result.success) {
        return { error: 'Failed to send 2FA code!' };
    }

    return { success: 'New code sent to your email!' };
};
