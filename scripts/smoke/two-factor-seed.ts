/**
 * Idempotent seed for 2FA smoke tests.
 * Creates (or updates) a single admin user with 2FA enabled.
 * Returns the {id, email} so smoke scripts can drive the flow.
 */
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export const TEST_USER_EMAIL = 'tfa-smoke@eitdc.test';
export const TEST_USER_PASSWORD = 'tfa-smoke-pw-only-used-locally';

export async function seedTwoFactorUser() {
  const existing = await db.user.findUnique({
    where: { email: TEST_USER_EMAIL },
  });
  if (existing) {
    await db.user.update({
      where: { id: existing.id },
      data: {
        isTwoFactorEnabled: true,
        isActive: true,
        emailVerified: existing.emailVerified || new Date(),
        password: await hashPassword(TEST_USER_PASSWORD),
        lastTwoFactorSentAt: null,
      },
    });
    return { id: existing.id, email: TEST_USER_EMAIL };
  }
  const user = await db.user.create({
    data: {
      email: TEST_USER_EMAIL,
      name: 'TFA Smoke',
      password: await hashPassword(TEST_USER_PASSWORD),
      emailVerified: new Date(),
      isTwoFactorEnabled: true,
      isActive: true,
    },
  });
  return { id: user.id, email: user.email! };
}
