// FIXME: Create rateLimit with hono.js
// src/lib/security.ts
// import { rateLimit } from 'express-rate-limit';
import jwt from "jsonwebtoken";

export interface JwtPayload {
  sub: string;    // your admin’s ID
  role: string;   // e.g. "GENERAL_MANAGER", etc.
}

/**
 * Sign a token for an admin
 */
export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "2h",
  });
}

/**
 * Verify and decode an incoming token.
 * Throws if invalid/expired.
 */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, process.env.NEXTAUTH_SECRET!, {
    algorithms: ["HS256"],
  }) as JwtPayload;
}

// export const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: 'Too many login attempts'
// });