# Authentication Integration

## NextAuth Mechanics
- Version: NextAuth.js v5.
- Connectors: `auth.ts` handles generic configuration binding `CredentialsSignin` alongside supported third-party providers. OAuth routes flow via `/api/auth/callback/...`.
- All routes inside `(dashboard)/admin` utilize server-side hydration tracking `auth()` resolution, throwing standard 401s interceptable by `Next.js` error boundaries or direct middleware traps redirecting to `/auth/login`.

## Security Enforcement
- MFA limits (Two-Factor authentication code generation limits) integrate state tracking to enforce cooldowns (`resendCooldown`).
- Tokens sent alongside verification logic (like password resets, user invitations) use `crypto` based unique hashes enforcing hard Date timeouts tracking exact expiry bounds matching UTC limits in the database tables.
