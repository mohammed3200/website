# Virtuozzo Deployment Analysis & Implementation Plan

> **Last Updated:** 2026-02-20
> **Status:** ✅ READY FOR DEPLOYMENT

## Current Project Status

### ✅ Production-Ready

- **S3 Storage:** Complete — all media uploaded to S3 via `s3-service.ts`. Image/Media models store only metadata (`url`, `s3Key`, `s3Bucket`). No BLOBs in database.
- **Dockerfile (App):** Multi-stage build, standalone output, non-root user, port 3000.
- **Dockerfile.worker:** Separate image with full `node_modules` and `tsx` for background workers (email, report, WhatsApp).
- **docker-compose.yml:** All environment variables via `${VAR}` substitution. No hardcoded credentials.
- **Workers:** 3 BullMQ workers (report, email, WhatsApp) orchestrated by `src/worker.ts` with graceful shutdown.
- **Auth:** NextAuth + RBAC system with 4 roles, 84 permissions, plus `ADMIN_API_KEY` middleware for system-to-system auth.
- **Health Check:** `/api/health` endpoint for monitoring.
- **i18n:** English + Arabic via `next-intl`.

---

## Deployment Architecture on Virtuozzo

```
┌─────────────────────────────────────────────────┐
│                 Virtuozzo Environment            │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  App     │  │  Worker  │  │  MySQL 8 │       │
│  │  (Docker)│  │  (Docker)│  │  (PaaS)  │       │
│  │  :3000   │  │          │  │  :3306   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │              │             │              │
│       └──────────────┴─────────────┘              │
│                Internal Network                   │
│                                                  │
│  ┌──────────┐  ┌──────────────────┐              │
│  │  Redis   │  │  S3 Storage      │              │
│  │  (PaaS)  │  │  (AWS/R2/MinIO)  │              │
│  │  :6379   │  │                  │              │
│  └──────────┘  └──────────────────┘              │
│                                                  │
│  ┌──────────────────────────────┐                │
│  │   Load Balancer (SSL/TLS)    │                │
│  │   Let's Encrypt Certificate  │                │
│  │   :443 → :3000               │                │
│  └──────────────────────────────┘                │
└─────────────────────────────────────────────────┘
```

---

## Deployment Steps

### Step 1: Build & Push Docker Images

```bash
# App container
docker build -t [username]/ebic-website:latest .
docker push [username]/ebic-website:latest

# Worker container
docker build -f Dockerfile.worker -t [username]/ebic-worker:latest .
docker push [username]/ebic-worker:latest
```

### Step 2: Create Virtuozzo Environment

1. Login → **New Environment** → **Docker Engine**
2. **Add MySQL 8** (PaaS-managed, NOT containerized)
   - Cloudlets: Reserved 2–4, Dynamic 4–8
3. **Add Redis 7+** (PaaS-managed)
4. **Add App Container:** `[username]/ebic-website:latest`, port 3000
   - Cloudlets: Reserved 4–8, Dynamic 8–16
5. **Add Worker Container:** `[username]/ebic-worker:latest`
   - Cloudlets: Reserved 2, Dynamic 4

### Step 3: Configure Environment Variables

Via Virtuozzo Dashboard → Container → Settings → Variables.

Copy all values from [.env.production.template](../.env.production.template). Critical variables:

```bash
DATABASE_URL=mysql://[user]:[pass]@[mysql-host]:3306/[dbname]
NEXTAUTH_URL=https://ebic.cit.edu.ly
NEXTAUTH_SECRET=[generated-secret]
REDIS_URL=redis://[redis-host]:6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ebic@cit.edu.ly
SMTP_PASS=[google-app-password]
AWS_REGION=auto
S3_ENDPOINT=https://[account].r2.cloudflarestorage.com
S3_BUCKET_NAME=ebic-media-production
AWS_ACCESS_KEY_ID=[key]
AWS_SECRET_ACCESS_KEY=[secret]
```

### Step 4: Database Initialization

Via Virtuozzo Web SSH into the app container:

```bash
npx prisma migrate deploy
npx tsx prisma/seed-rbac.ts
npx tsx scripts/verify-rbac.ts
# Expected: ✅ RBAC INTEGRITY CHECK PASSED
```

### Step 5: Domain & SSL

1. Virtuozzo → Settings → Custom Domains → `ebic.cit.edu.ly`
2. Enable Let's Encrypt SSL via Load Balancer add-on
3. DNS: A record `ebic` → Virtuozzo Environment IP

### Step 6: Verification

- [ ] Homepage loads at `https://ebic.cit.edu.ly`
- [ ] Admin login works
- [ ] Innovator form submission + image upload to S3
- [ ] Email notifications sent
- [ ] Arabic/English language switching
- [ ] RBAC integrity check passes
- [ ] Worker logs show "Background worker started..."

---

## Resource Allocation

| Node             | Reserved           | Dynamic Max       |
| ---------------- | ------------------ | ----------------- |
| App Container    | 4 cloudlets (2GB)  | 8 cloudlets (4GB) |
| Worker Container | 2 cloudlets (1GB)  | 4 cloudlets (2GB) |
| MySQL 8          | 2 cloudlets (1GB)  | 4 cloudlets (2GB) |
| Redis            | 1 cloudlet (512MB) | 2 cloudlets (1GB) |

## S3 Provider Options

| Provider          | Free Tier                   | After Free Tier       | Recommendation  |
| ----------------- | --------------------------- | --------------------- | --------------- |
| AWS S3            | 5GB / 12 months             | ~$0.023/GB/mo         | Year 1          |
| Cloudflare R2     | 10GB / forever, zero egress | ~$0.015/GB/mo         | Year 2+         |
| Self-hosted MinIO | N/A                         | ~$10–15/mo (RAM cost) | Not recommended |

---

## Rollback Plan

```bash
# Emergency: In Virtuozzo Dashboard
1. Stop application container
2. Redeploy previous image tag: [username]/ebic-website:v0.9.0
3. Restart container

# Database: Virtuozzo auto-creates daily backups
MariaDB Node → Backup → Restore → Select pre-deployment backup
```

## Security Notes

- `.env` is in `.gitignore` — never committed
- Production secrets generated via `crypto.randomBytes()` — see `docs/Production_Secrets.md`
- Previous secrets in git history should be purged with `bfg` or `git filter-repo`
- ADMIN_API_KEY provides system-to-system auth via `X-Admin-API-Key` header
