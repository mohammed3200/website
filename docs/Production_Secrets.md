# Production Secrets Generation - 2026-02-19 (ROTATED)

> [!CAUTION]
> Previous secrets (NEXTAUTH_SECRET, ADMIN_API_KEY, SMTP_PASS) were committed to the repository history. They are COMPROMISED. The values below are redacted placeholders. You MUST generate fresh ones and store them only in your deployment platform's environment variables.

## Authentication Secret (NEXTAUTH_SECRET)

**Generated:** `<REDACTED_AND_ROTATED>`
**Command:** `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`
**Usage:** JWT token signing, session encryption

## Admin API Key (ADMIN_API_KEY)

**Generated:** `<REDACTED_AND_ROTATED>`
**Command:** `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
**Usage:** Administrative API authentication

## SMTP Password (SMTP_PASS)

**Obtained:** `<REDACTED_SMTP_PASSWORD>`
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
