import { db } from '@/lib/db';

/**
 * Purge all expired authentication tokens from the database.
 * Should be called on a schedule (e.g., nightly via BullMQ repeatable job).
 */
export async function cleanupExpiredTokens() {
    const now = new Date();

    const [twoFactor, verification, passwordReset] = await Promise.all([
        db.twoFactorToken.deleteMany({
            where: { expires: { lt: now } },
        }),
        db.verificationToken.deleteMany({
            where: { expires: { lt: now } },
        }),
        db.passwordResetToken.deleteMany({
            where: { expires: { lt: now } },
        }),
    ]);

    const total = twoFactor.count + verification.count + passwordReset.count;

    console.log(
        `[Token Cleanup] Purged ${total} expired tokens:`,
        `2FA=${twoFactor.count}, Verification=${verification.count}, PasswordReset=${passwordReset.count}`
    );

    return { twoFactor: twoFactor.count, verification: verification.count, passwordReset: passwordReset.count, total };
}
