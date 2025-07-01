// src/lib/auth.ts
import { hash, compare } from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Securely hashes a password using bcrypt
 * @param password Plain text password to hash
 * @returns Promise resolving to hashed password
 * @throws Error if hashing fails
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await hash(password, SALT_ROUNDS);
  } catch (error) {
    throw new Error('Password hashing failed', { cause: error });
  }
};

/**
 * Compares a plain text password with a hashed password
 * @param password Plain text password to verify
 * @param hashedPassword Hashed password to compare against
 * @returns Promise resolving to boolean indicating match
 * @throws Error if comparison fails
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Password comparison failed', { cause: error });
  }
};