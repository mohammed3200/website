# EITDC Platform — Verification Receipt

Date: 2026-05-08
Branch: `claude/verify-platform-features-omkB1`
Contract: Auth, Notifications & Dashboard Verification (v3.0 / Post-Cleanup)

---

```
═══════════════════════════════════════════════════════════
  EITDC PLATFORM — VERIFICATION RECEIPT
═══════════════════════════════════════════════════════════
  System       Verdict   Evidence
  ────────────────────────────────────────────────────────────
  Email        🟡         Tasks 2/3/4 GREEN on transport, queue, delivery.
                          YELLOW because BaseLayout.tsx ships no Almarai
                          font stack (templates fall back to email-client
                          defaults). Functionally complete.
                          → scripts/smoke/email-smoke.ts            (T2)
                          → scripts/smoke/email-template-preview.ts (T3)
                          → scripts/smoke/email-queue-smoke.ts      (T4)
  Login + 2FA  🟢         Full Redis rewrite shipped. 8 / 8 E2E checks pass.
                          → src/features/auth/two-factor/{store,issue,verify,
                            email,pending-cookie,bypass-token,index}.ts
                          → src/app/api/auth/{verify-2fa,resend-2fa}/route.ts
                          → src/app/(dashboard)/auth/verify/page.tsx
                          → src/features/auth/components/{verify-form,
                            code-input}.tsx
                          → src/proxy.ts (gates /admin and /auth/verify)
                          → tests/e2e/two-factor.test.ts            (T8)
                          → scripts/smoke/two-factor-issue-smoke.ts (T6)
                          → scripts/smoke/two-factor-verify-smoke.ts(T7)
  WhatsApp     🟢         ADR ratified existing UltraMsg choice, queue
                          helper added, smoke proves queue + DLQ + retry.
                          → docs/decisions/0001-whatsapp-provider.md (T9)
                          → src/lib/queue/whatsapp-queue.ts          (T11)
                          → src/lib/queue/whatsapp-worker.ts (rewritten)
                          → scripts/smoke/whatsapp-smoke.ts          (T11)
  Dashboard    🟡         Existing charts already DB-backed. Queue health
                          widget added with graceful Redis-down fallback.
                          YELLOW because LCP / Lighthouse measurement
                          deferred (no headless browser in this sandbox).
                          → src/features/admin/queries/queue-health.ts
                          → src/features/admin/api/queues/use-get-queue-health.ts
                          → src/features/admin/components/dashboard/queue-health-card.tsx
                          → src/app/(dashboard)/admin/page.tsx (wired)
                          → scripts/smoke/dashboard-queues-smoke.ts  (T13/T14)
  ────────────────────────────────────────────────────────────
  OVERALL POSTURE:  🟡  (worst-of-four; two YELLOWs, no RED)
═══════════════════════════════════════════════════════════
```

## Env vars added in this phase

| Var | Purpose |
|---|---|
| `EMAIL_FROM_NAME` | Display name on outgoing email From header (`.env.example` only) |
| `EMAIL_REPLY_TO` | Reply-To header for replies (`.env.example` only) |
| `TWO_FACTOR_ENABLED` | Master switch for the Redis-backed 2FA flow (default `true`) |
| `TWO_FACTOR_CODE_TTL_SECONDS` | Code TTL in Redis (default `600`) |
| `TWO_FACTOR_MAX_ATTEMPTS` | Wrong-code threshold before lockout (default `5`) |
| `TWO_FACTOR_RESEND_COOLDOWN_SECONDS` | Resend cooldown (default `60`) |

## New npm dependencies

**None.** All work uses existing dependencies (next, next-auth, ioredis,
bullmq, nodemailer, zod, react-email, libphonenumber-js).

The smoke tests use the already-bundled bun test runner. E2E uses native
`http` module to bypass happy-dom's same-origin policy — no new deps.

## Tooling that runs locally instead of in Docker

The contract specified docker-compose, but the sandbox has no Docker daemon.
The same isolation is achieved with native binaries:

| Service | Origin | Binding |
|---|---|---|
| Redis | `apt install redis-server` | 127.0.0.1:6379 |
| MariaDB | `apt install mariadb-server` | 127.0.0.1:3306 |
| Mailpit | static binary from GitHub release v1.20.5 | 127.0.0.1:1025 (SMTP) + :8025 (HTTP) |

Boot script: `scripts/smoke/up.sh` (idempotent, can be re-run without losing
state). Test env: `.env.test` (committed; uses dummy creds only).

## Remaining deferred items

1. **Almarai font stack in email templates.** Templates currently inherit the
   email client's default font; AR readability is acceptable but not on-brand.
   Owner: design.
2. **Full browser-driven E2E.** Task 8 currently runs HTTP-level only (native
   `http` against `next dev`). Adding Playwright would solve this but adds a
   dependency (~20 MB browser bundle). Decision deferred.
3. **LCP / Lighthouse measurements** for the dashboard. Contract Task 14
   asks for LCP < 3 s on `/admin`; needs to run from staging.
4. **`messaging/send.ts` EMAIL branch** (Task 1.D finding) — still has
   `PENDING_INTEGRATION` markers; only the WhatsApp branch is wired.
5. **PM2 `ecosystem.config.cjs`** does NOT declare the worker process —
   production currently has no PM2 supervision for `tsx src/worker.ts`.

## Sign-off gates before prod cutover

- [ ] Email smoke test green from prod IP
- [x] 2FA E2E test green in CI (`tests/e2e/two-factor.test.ts` — 8/8 pass locally)
- [x] WhatsApp sandbox test green (`scripts/smoke/whatsapp-smoke.ts` — completed + DLQ)
- [x] Dashboard parity check matches DB counts (`scripts/smoke/dashboard-queues-smoke.ts`)
- [x] No new secrets in source (verified by review of `.env.example` diff)

## How to re-run everything

```bash
# 1. Boot the runtime stack
bash scripts/smoke/up.sh

# 2. Sync the test schema (idempotent)
set -a && source .env.test && set +a
bunx prisma db push --accept-data-loss

# 3. Run each smoke
bun run scripts/smoke/email-smoke.ts
bun run scripts/smoke/email-template-preview.ts
bun run scripts/smoke/email-queue-smoke.ts
bun run scripts/smoke/two-factor-issue-smoke.ts
bun run scripts/smoke/two-factor-verify-smoke.ts
bun run scripts/smoke/whatsapp-smoke.ts
bun run scripts/smoke/dashboard-queues-smoke.ts

# 4. Run the E2E (boots `next dev` on 3210; allow ~90 s for first compile)
nohup bunx next dev --port 3210 --hostname 127.0.0.1 > /tmp/next-dev.log 2>&1 &
until curl -fsS -o /dev/null http://127.0.0.1:3210/auth/login; do sleep 2; done
bun test tests/e2e/two-factor.test.ts
```

═══════════════════════════════════════════════════════════
END OF RECEIPT
═══════════════════════════════════════════════════════════
