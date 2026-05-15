import { db } from '@/lib/db';

/**
 * Purge all expired authentication tokens from the database.
 * Should be called on a schedule (e.g., nightly via BullMQ repeatable job).
 */
export async function cleanupExpiredTokens() {
    const now = new Date();

    const [twoFactor, verification, passwordReset, invitations] = await Promise.all([
        db.twoFactorToken.deleteMany({
            where: { expires: { lt: now } },
        }),
        db.verificationToken.deleteMany({
            where: { expires: { lt: now } },
        }),
        db.passwordResetToken.deleteMany({
            where: { expires: { lt: now } },
        }),
        db.userInvitation.deleteMany({
            where: {
                status: 'PENDING',
                expiresAt: { lt: now }
            }
        })
    ]);

    const total = twoFactor.count + verification.count + passwordReset.count + invitations.count;

    console.log(
        `[Token Cleanup] Purged ${total} expired tokens:`,
        `2FA=${twoFactor.count}, Verification=${verification.count}, PasswordReset=${passwordReset.count}, Invitations=${invitations.count}`
    );

    return { twoFactor: twoFactor.count, verification: verification.count, passwordReset: passwordReset.count, invitations: invitations.count, total };
}
