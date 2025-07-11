import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordRestTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getVerificationTokenByEmail(email);
  
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id }
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getPasswordRestTokenByEmail(email);
  
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string) => {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes

  const existingToken = await getTwoFactorTokenByEmail(email);
  
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id }
    });
  }

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return twoFactorToken;
};
