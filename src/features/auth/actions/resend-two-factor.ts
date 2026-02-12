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

    // Cooldown check (3 minutes)
    const COOLDOWN_MINUTES = 3;
    if (existingUser.lastTwoFactorSentAt) {
        const cooldownTime = new Date(existingUser.lastTwoFactorSentAt.getTime() + COOLDOWN_MINUTES * 60 * 1000);
        if (new Date() < cooldownTime) {
            return { error: `Please wait ${COOLDOWN_MINUTES} minutes before requesting another code.` };
        }
    }

    const twoFactorToken = await generateTwoFactorToken(existingUser.email);

    // Update cooldown timestamp
    const { db } = await import('@/lib/db');
    await db.user.update({
        where: { id: existingUser.id },
        data: { lastTwoFactorSentAt: new Date() }
    });

    const userName = existingUser.name || existingUser.email.split('@')[0];

    const result = await emailService.send2FA(
        {
            name: userName,
            email: twoFactorToken.email,
            code: twoFactorToken.token,
        },
        'en', // Default locale
        '5 minutes',
    );

    if (!result.success) {
        return { error: 'Failed to send 2FA code!' };
    }

    return { success: 'New code sent to your email!' };
};
