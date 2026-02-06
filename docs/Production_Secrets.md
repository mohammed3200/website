# Production Secrets Generation - 2026-02-05

## Authentication Secret (NEXTAUTH_SECRET)
**Generated:** `MPfW1ORMlIAv8+wqZ66j2kdYoNmL1UYRGH4qeNOkjVDpP8M+oMEDHGWSTrDJ6Pxa`
**Command:** `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`
**Usage:** JWT token signing, session encryption

## Admin API Key (ADMIN_API_KEY)
**Generated:** `d9acd7bd20396a919dce0b34e9eae973c4ef4d3bc760f2795a8200570f2440fd`
**Command:** `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
**Usage:** Administrative API authentication

## SMTP Password (SMTP_PASS)
**Obtained:** `xzrctzuobujqdmsk`
**Source:** Google App Passwords (https://myaccount.google.com/apppasswords)
**Account:** ebic@cit.edu.ly
**Date:** User-provided 2026-02-05

## Email Token Secret
**Command:** `openssl rand -hex 32`
**Usage:** Email verification tokens

## Security Checklist
- [x] SMTP password obtained from Google App Passwords
- [ ] Replace all development secrets in production
- [ ] Never commit production secrets to repository
- [ ] Store secrets securely (Virtuozzo environment variables)
- [ ] Rotate secrets if exposed
- [ ] Use different secrets for dev/staging/production

## Deployment Instructions
1. Copy `.env.production.template` to `.env.production`
2. Replace all `[PLACEHOLDER]` values
3. Add `.env.production` to `.gitignore`
4. Configure secrets in Virtuozzo Dashboard (Environment Variables)
5. Never push `.env.production` to git
