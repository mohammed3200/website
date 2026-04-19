# Production Readiness Audit + cPanel Deployment Blueprint

**Date**: April 19, 2026  
**Project**: EBIC Platform (Center for Entrepreneurship & Business Incubators — Misurata)  
**Auditor**: Elite AI Production Engineering System

---

## 📦 STAGE 1 — FOUNDATIONS AUDIT

### Architecture Summary

| Layer | Technology | Production Impact |
|---|---|---|
| Runtime | Node.js 20 + Next.js 16 (App Router) | Requires persistent Node process |
| Backend | Hono.js API routes (inside Next.js) | Single-process, no separate backend |
| Database | MySQL 8.0 via Prisma 7 + MariaDB adapter | Needs MySQL/MariaDB server |
| Auth | NextAuth v5 (JWT strategy, 2h expiry) | Needs `NEXTAUTH_SECRET` + HTTPS |
| Queue | BullMQ (email, reports, WhatsApp workers) | **Requires Redis** |
| Cache | ioredis (rate limiting, data caching) | **Requires Redis** |
| Storage | AWS S3 / MinIO / Cloudflare R2 | External service required |
| Email | Nodemailer (SMTP direct) | External SMTP required |
| i18n | next-intl (Arabic RTL / English LTR) | No production impact |
| Build | Standalone output (115MB) | Optimized for containers |

### Rendering Strategy Analysis

| Route Pattern | Type | SSR Cost |
|---|---|---|
| `/[locale]` (homepage) | SSR + Client | Medium |
| `/[locale]/collaborators` | SSR | Low |
| `/[locale]/collaborators/registration/[step]` | SSR + Heavy Client (Zustand) | Medium |
| `/[locale]/innovators/registration/[step]` | SSR + Heavy Client (Zustand) | Medium |
| `/[locale]/terms`, `/[locale]/privacy` | SSR (DB fetch) | Low |
| `/[locale]/faq` | SSR (DB fetch) | Low |
| `/[locale]/contact` | Static-like | Very Low |
| `/admin/*` | Client-side (`'use client'`) | Low (no SSR) |
| `/auth/*` | Client-side | Low |

### Memory-Heavy Dependencies

| Package | Size Impact | Required? |
|---|---|---|
| `sharp` (image optimization) | ~30MB native binary | ✅ Yes (Next.js images) |
| `@aws-sdk/client-s3` | ~15MB | ✅ Yes (file storage) |
| `bullmq` + `ioredis` | ~5MB | ⚠️ Can be made optional |
| `recharts` | ~8MB (client-only) | ✅ Yes (admin charts) |
| `framer-motion` | ~5MB (client-only) | ✅ Yes (animations) |
| `maplibre-gl` | ~10MB (client-only) | ⚠️ Only for contact map |
| `jspdf` + `xlsx` | ~5MB | ✅ Yes (report export) |
| `@react-email/components` | ~3MB | ✅ Yes (email templates) |
| `react-icons` + `lucide-react` + `@tabler/icons-react` | 3 icon libraries | ⚠️ Redundant — tree-shake |

### Build Artifact Sizes

| Artifact | Size |
|---|---|
| `.next/standalone/` | **115MB** |
| `.next/static/` | **6.2MB** |
| `public/` | **3.9MB** |
| **Total deployment** | **~125MB** |

---

## 🚨 STAGE 2 — PROBLEM DETECTION

### A. Authentication

---

#### A1. Admin Login Redirect

| Field | Value |
|---|---|
| **Status** | ✅ OK |
| **Why it matters** | Core admin access flow |
| **Local risk** | None |
| **Production risk** | None — `proxy.ts` correctly handles unauthenticated → `/auth/login`, authenticated → `/admin/dashboard` |
| **Fix priority** | N/A |

---

#### A2. Secure Cookie / HTTPS Configuration

| Field | Value |
|---|---|
| **Status** | ⚠️ PARTIAL |
| **Why it matters** | JWT tokens in cookies MUST be secure in production |
| **Local risk** | None (dev mode) |
| **Production risk** | **HIGH** — `AUTH_TRUST_HOST=true` is set in docker-compose (correct for reverse proxy). But no explicit `secureCookie` override in NextAuth config. NextAuth auto-sets secure cookies when `NEXTAUTH_URL` starts with `https://`. If NEXTAUTH_URL is misconfigured as `http://`, cookies won't be secure. |
| **Fix priority** | 🔴 HIGH |
| **Suggested solution** | Ensure `NEXTAUTH_URL` always starts with `https://` in production. Add verification in startup. |

---

#### A3. Test Auth API Route in Production

| Field | Value |
|---|---|
| **Status** | ❌ FAIL (Security) |
| **Why it matters** | `/api/test/auth` is a CSRF-bypassing login endpoint |
| **Local risk** | None (guarded by `NODE_ENV !== 'development'`) |
| **Production risk** | **CRITICAL** — While the guard returns 403 in production, this route **should not ship in production builds at all**. The route exists in the source tree and will be compiled into the production bundle. An attacker who discovers a way to manipulate `NODE_ENV` at runtime can bypass authentication. Defense-in-depth demands removing test routes entirely. |
| **Fix priority** | 🔴 CRITICAL |
| **Suggested solution** | Delete `src/app/api/test/` directory before production build, or move to `tests/` directory. |

---

### B. Forms System

---

#### B1. Collaborator Form Wizard Missing Props

| Field | Value |
|---|---|
| **Status** | ✅ OK (Fixed in previous session) |
| **Why it matters** | UI correctness for step navigation |
| **Local risk** | None (fixed) |
| **Production risk** | None |
| **Fix priority** | N/A |

---

#### B2. File Upload Size Limit Bug

| Field | Value |
|---|---|
| **Status** | ❌ FAIL |
| **Why it matters** | `MAX_FILE_SIZE` in `constants/index.ts` is set to `50 * 1024 * 1024 * 1024` = **50 GB**, not 50 MB |
| **Local risk** | Memory exhaustion |
| **Production risk** | **CRITICAL** — A single upload could consume all RAM and crash the server. On a 1GB VPS this is an instant denial-of-service. |
| **Fix priority** | 🔴 CRITICAL |
| **Suggested solution** | Change to `50 * 1024 * 1024` (50 MB). Also add server-side body size limits in Next.js config. |

---

#### B3. Form Data Persistence / Hydration

| Field | Value |
|---|---|
| **Status** | ✅ OK |
| **Why it matters** | Multi-step forms persist across page refreshes |
| **Local risk** | None |
| **Production risk** | None — Zustand with sessionStorage, File objects correctly excluded from serialization, hydration flag controls render |
| **Fix priority** | N/A |

---

### C. Footer Legal Pages

---

#### C1. Footer Links

| Field | Value |
|---|---|
| **Status** | ✅ OK (Fixed in previous session) |
| **Why it matters** | Terms/Privacy links must work for legal compliance |
| **Local risk** | None (fixed) |
| **Production risk** | None |
| **Fix priority** | N/A |

---

#### C2. Social Media Links

| Field | Value |
|---|---|
| **Status** | ⚠️ PARTIAL |
| **Why it matters** | Footer social icons all link to `href="#"` |
| **Local risk** | Dead links |
| **Production risk** | **LOW** — Unprofessional but not a blocker. All 4 social links (Facebook, Twitter, LinkedIn, WhatsApp) in `constants/index.ts` point to `#`. |
| **Fix priority** | 🟡 MEDIUM |
| **Suggested solution** | Update with real social media URLs or hide until configured. |

---

### D. Error Pages

---

#### D1. Error Page Quality

| Field | Value |
|---|---|
| **Status** | ✅ OK |
| **Why it matters** | Users shouldn't see raw error screens |
| **Local risk** | None |
| **Production risk** | None — `global-error.tsx`, `[locale]/error.tsx`, `[locale]/not-found.tsx` all implemented with proper i18n |
| **Fix priority** | N/A |

---

### E. Database / Prisma

---

#### E1. Prisma Connection Pool

| Field | Value |
|---|---|
| **Status** | ⚠️ PARTIAL |
| **Why it matters** | Shared hosting MySQL often limits connections to 10-25 |
| **Local risk** | None |
| **Production risk** | **HIGH** — The Prisma client uses `PrismaMariaDb` adapter with no explicit connection pool limit configured. The default pool size could exhaust MySQL connection limits on cPanel hosting. Combined with the worker process (which also opens its own Prisma client), this doubles the risk. |
| **Fix priority** | 🔴 HIGH |
| **Suggested solution** | Add `connection_limit` to `DATABASE_URL`: `mysql://user:pass@host:3306/db?connection_limit=5`. Or configure in Prisma adapter options. |

---

#### E2. Dual Prisma Client (App + Worker)

| Field | Value |
|---|---|
| **Status** | ⚠️ PARTIAL |
| **Why it matters** | Two processes opening separate DB connections doubles connection usage |
| **Local risk** | None |
| **Production risk** | **MEDIUM** — The main app process AND the BullMQ worker process each instantiate their own Prisma Client. On a resource-constrained VPS with limited MySQL connections, this can cause "Too many connections" errors. |
| **Fix priority** | 🟡 MEDIUM |
| **Suggested solution** | If running without Redis/BullMQ, worker can be eliminated. Otherwise, set very low connection limits for the worker. |

---

### F. Next.js Production Risks

---

#### F1. No Security Headers

| Field | Value |
|---|---|
| **Status** | ❌ FAIL |
| **Why it matters** | Missing CSP, X-Frame-Options, HSTS, X-Content-Type-Options |
| **Local risk** | None |
| **Production risk** | **HIGH** — No security headers configured anywhere (no `headers()` in `next.config.ts`, no middleware headers). The site is vulnerable to clickjacking, MIME sniffing, and missing HSTS. |
| **Fix priority** | 🔴 HIGH |
| **Suggested solution** | Add `headers()` config to `next.config.ts` with: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy`, and basic CSP. |

---

#### F2. dangerouslySetInnerHTML Usage

| Field | Value |
|---|---|
| **Status** | ✅ OK (Mitigated) |
| **Why it matters** | XSS attack vector |
| **Local risk** | None |
| **Production risk** | **LOW** — 4 usages found, all properly sanitized: News uses `DOMPurify.sanitize()`, Legal content uses `sanitizeHtml()` from `sanitizer.ts`. Template editor is admin-only (RBAC protected). |
| **Fix priority** | N/A |

---

#### F3. Redis Dependency (Fail-Fast in Production)

| Field | Value |
|---|---|
| **Status** | ❌ FAIL for cPanel |
| **Why it matters** | Currently **crash-on-startup** if Redis is unavailable in production |
| **Local risk** | None (dev fallback) |
| **Production risk** | **CRITICAL for cPanel** — `redis.ts` line 53: `throw new Error('REDIS_URL is not defined')` in production. Most cPanel hosts don't provide Redis. The app literally cannot start without it. |
| **Fix priority** | 🔴 CRITICAL |
| **Suggested solution** | Make Redis optional — use in-memory LRU cache fallback (already have `lru-cache` in deps). Send emails synchronously instead of via BullMQ queue. Rate limiting can use in-memory store. |

---

#### F4. Worker Process Requirement

| Field | Value |
|---|---|
| **Status** | ⚠️ PARTIAL |
| **Why it matters** | BullMQ worker is a separate Node.js process consuming extra RAM |
| **Local risk** | None |
| **Production risk** | **HIGH for low-resource** — The worker runs 3 consumers (email, reports, WhatsApp) as a separate process. On a 512MB-1GB VPS, running 2 Node processes (app + worker) will likely result in OOM kills. |
| **Fix priority** | 🔴 HIGH |
| **Suggested solution** | For low-resource deployment: eliminate worker, send emails synchronously, generate reports on-request. Only re-enable worker when Redis + adequate RAM is available. |

---

#### F5. Image Optimization Memory

| Field | Value |
|---|---|
| **Status** | ⚠️ PARTIAL |
| **Why it matters** | `sharp` uses ~50-100MB RAM per concurrent image optimization |
| **Local risk** | None |
| **Production risk** | **MEDIUM** — Next.js image optimization with sharp can spike memory. On 512MB RAM this is dangerous. |
| **Fix priority** | 🟡 MEDIUM |
| **Suggested solution** | In `next.config.ts`, add `images: { minimumCacheTTL: 86400 }` to cache aggressively. Consider `unoptimized: true` if using CDN for images. |

---

### G. Security

---

#### G1. No Rate Limiting Without Redis

| Field | Value |
|---|---|
| **Status** | ⚠️ PARTIAL |
| **Why it matters** | Rate limiter is Redis-based. Without Redis, it fails open (allows all requests) |
| **Local risk** | None |
| **Production risk** | **HIGH** — `rate-limit.ts` catch block returns `success: true` on Redis failure. Without Redis, ALL rate limiting is disabled silently. Login brute-force, form spam, etc. |
| **Fix priority** | 🔴 HIGH |
| **Suggested solution** | Add in-memory rate limiter fallback using `lru-cache`. |

---

#### G2. CORS / Allowed Origins

| Field | Value |
|---|---|
| **Status** | ⚠️ PARTIAL |
| **Why it matters** | `ALLOWED_ORIGINS` is used but not validated in middleware |
| **Local risk** | None |
| **Production risk** | **MEDIUM** — The env variable exists but I see no middleware enforcement of CORS headers. The Hono API routes don't appear to have CORS middleware. |
| **Fix priority** | 🟡 MEDIUM |
| **Suggested solution** | Add Hono CORS middleware with origin whitelist from `ALLOWED_ORIGINS`. |

---

## Summary: All Issues

| # | Issue | Status | Priority |
|---|---|---|---|
| 1 | Test auth API route ships to production | ❌ FAIL | 🔴 CRITICAL |
| 2 | MAX_FILE_SIZE is 50GB instead of 50MB | ❌ FAIL | 🔴 CRITICAL |
| 3 | Redis fail-fast crashes app on startup | ❌ FAIL | 🔴 CRITICAL |
| 4 | No security headers (CSP, HSTS, etc.) | ❌ FAIL | 🔴 HIGH |
| 5 | Prisma connection pool not configured | ⚠️ PARTIAL | 🔴 HIGH |
| 6 | Worker process doubles RAM usage | ⚠️ PARTIAL | 🔴 HIGH |
| 7 | Rate limiting disabled without Redis | ⚠️ PARTIAL | 🔴 HIGH |
| 8 | Secure cookie depends on NEXTAUTH_URL scheme | ⚠️ PARTIAL | 🔴 HIGH |
| 9 | Image optimization memory spikes | ⚠️ PARTIAL | 🟡 MEDIUM |
| 10 | Social media links are dead (#) | ⚠️ PARTIAL | 🟡 MEDIUM |
| 11 | CORS not enforced on API routes | ⚠️ PARTIAL | 🟡 MEDIUM |
| 12 | Dual Prisma clients (app+worker) | ⚠️ PARTIAL | 🟡 MEDIUM |
| 13 | Admin login redirect | ✅ OK | — |
| 14 | Error pages | ✅ OK | — |
| 15 | Footer legal links | ✅ OK | — |
| 16 | Form wizard props | ✅ OK | — |
| 17 | Form persistence/hydration | ✅ OK | — |
| 18 | XSS sanitization | ✅ OK | — |

---

## 🚀 STAGE 3 — cPANEL DEPLOYMENT BLUEPRINT

### Can This Run on cPanel Shared Hosting?

> [!CAUTION]
> **NO. cPanel shared hosting is NOT viable for this project.**

**Reasons:**
1. Next.js requires a **persistent Node.js process** — cPanel shared hosting kills long-running processes
2. No root access to install PM2, configure reverse proxy, or run background workers
3. Most shared hosts limit MySQL connections to 10-15 — Prisma can exhaust this
4. No Redis available on shared hosting
5. Memory limits (128-256MB typical) are far below the ~300-500MB this app needs
6. No custom port binding or reverse proxy configuration

### Recommended: VPS with cPanel (WHM)

| Requirement | Minimum | Recommended |
|---|---|---|
| **RAM** | 2GB | 4GB |
| **CPU** | 1 vCPU | 2 vCPU |
| **Storage** | 20GB SSD | 40GB SSD |
| **OS** | AlmaLinux 8/9 or Ubuntu 22.04 | Same |
| **Node.js** | v20 LTS | v20 LTS |
| **MySQL** | 8.0 | 8.0 |
| **Redis** | Optional (see optimization) | Recommended |
| **PM2** | ✅ Required | ✅ Required |
| **Reverse Proxy** | ✅ Required (Apache/Nginx) | Nginx recommended |

> [!IMPORTANT]
> **Why 2GB minimum, not 1GB**: Next.js standalone + sharp image optimization + Prisma query engine = ~350-500MB base. With OS + MySQL, 1GB will OOM under any load. 2GB gives adequate headroom.

### Architecture for cPanel VPS

```
Internet → cPanel (Apache/Nginx) → Reverse Proxy → PM2 (Node.js :3000)
                                                       ↓
                                                   MySQL 8.0
                                                       ↓
                                                 S3 (External)
```

**With Redis (recommended):**
```
PM2 Instance 1: Next.js App (:3000)
PM2 Instance 2: BullMQ Worker
Redis: localhost:6379
MySQL: localhost:3306
```

**Without Redis (minimum cost):**
```
PM2 Instance 1: Next.js App (:3000) — emails sent synchronously
MySQL: localhost:3306
```

---

## ⚡ RESOURCE OPTIMIZATION PLAN

### A. Make Redis Optional (For Minimum Deployment)

The biggest cost/complexity reduction is **removing the Redis requirement**. This eliminates:
- Redis server process (~30MB RAM)
- BullMQ worker process (~150MB RAM)
- Redis hosting cost

**What changes:**
1. `redis.ts` — Return in-memory mock in production when `REDIS_URL` is not set (instead of throwing)
2. `cache.ts` — Use `lru-cache` (already in deps) as fallback
3. `rate-limit.ts` — Use in-memory Map with TTL as fallback
4. `email/service.ts` — Send synchronously when queue unavailable (already partially handles this)
5. Remove worker from PM2 ecosystem

**Trade-offs:**
- ✅ Saves ~180MB RAM and $5-10/month Redis hosting
- ❌ Emails sent synchronously (adds 1-3s to form submission response)
- ❌ Rate limits reset on server restart
- ❌ Cache lost on restart

### B. Frontend Optimization

| Optimization | Impact | Effort |
|---|---|---|
| Set `images.minimumCacheTTL: 86400` in next.config | Reduces sharp processing | Low |
| Lazy-load `maplibre-gl` (contact page only) | Save ~10MB from initial bundle | Low |
| Remove one of 3 icon libraries (react-icons OR tabler) | Reduce bundle 2-5% | Medium |
| Consider `images.unoptimized: true` if using CDN | Eliminates sharp RAM spikes | Low |

### C. Backend Optimization

| Optimization | Impact | Effort |
|---|---|---|
| Add `connection_limit=5` to DATABASE_URL | Prevent connection exhaustion | Low |
| Configure Prisma logging to `['error']` only | Reduce I/O | Already done |
| Remove `console.log` debugging in registration pages | Reduce I/O | Low |

### D. Infrastructure

| Optimization | Impact | Effort |
|---|---|---|
| PM2 with `max_memory_restart: '400M'` | Prevent OOM kills | Low |
| Enable gzip in Nginx/Apache reverse proxy | 60-80% transfer reduction | Low |
| Set `NODE_OPTIONS='--max-old-space-size=512'` | Cap V8 heap | Low |
| Aggressive static caching headers | Reduce server load | Low |

---

## 🛡 SECURITY HARDENING PLAN

### Immediate Actions (Pre-Launch)

#### 1. Remove Test Auth Route
```bash
rm -rf src/app/api/test/
```

#### 2. Fix MAX_FILE_SIZE
```typescript
// src/constants/index.ts line 40
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (NOT 50GB!)
```

#### 3. Add Security Headers to next.config.ts
```typescript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  }];
},
```

#### 4. Add In-Memory Rate Limit Fallback
Use `lru-cache` when Redis is unavailable to prevent brute-force attacks.

#### 5. Validate NEXTAUTH_URL Protocol
Add a startup check that `NEXTAUTH_URL` starts with `https://`.

---

## 📋 STEP-BY-STEP DEPLOYMENT GUIDE (cPanel VPS)

### Phase 1: Server Setup

```bash
# 1. Access VPS via SSH
ssh root@your-vps-ip

# 2. Install Node.js 20 (if not via cPanel)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Install Bun (for seeds/migrations)
curl -fsSL https://bun.sh/install | bash

# 5. Verify MySQL is running (cPanel provides this)
mysql -u root -p -e "SELECT VERSION();"
```

### Phase 2: Database Setup

```bash
# 1. Create database via cPanel → MySQL Databases
#    Database: citcoder_eitdc
#    User: ebic_user
#    Grant ALL privileges

# 2. Test connection
mysql -u ebic_user -p citcoder_eitdc -e "SELECT 1;"
```

### Phase 3: Application Deployment

```bash
# 1. Create app directory
mkdir -p /home/your_cpanel_user/apps/ebic
cd /home/your_cpanel_user/apps/ebic

# 2. Clone or upload built standalone app
# Option A: Build locally, upload
# On your LOCAL machine:
bun run build
tar -czf ebic-deploy.tar.gz .next/standalone .next/static public

# On server:
tar -xzf ebic-deploy.tar.gz

# 3. Create .env file
cp .env.production.template .env
nano .env
# Fill all CHANGE_ME values:
# DATABASE_URL=mysql://ebic_user:PASSWORD@localhost:3306/citcoder_eitdc
# NEXTAUTH_URL=https://ebic.cit.edu.ly
# NEXTAUTH_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(48).toString('base64'))">
# ... all other values

# 4. Copy Prisma schema for migrations
cp -r prisma/ ./prisma/
cp prisma.config.ts ./

# 5. Run migrations
npx prisma migrate deploy

# 6. Run seeds
bun run prisma/seed-rbac.ts
bun run prisma/seed.ts
bun run prisma/seed-templates.ts
```

### Phase 4: PM2 Configuration

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'ebic-app',
    script: 'server.js',
    cwd: '/home/your_cpanel_user/apps/ebic',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '400M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '127.0.0.1',
      NODE_OPTIONS: '--max-old-space-size=512',
    },
    // Load .env from app directory
    env_file: '/home/your_cpanel_user/apps/ebic/.env',
  }]
};
```

```bash
# Start app
pm2 start ecosystem.config.js

# Save PM2 process list for auto-restart
pm2 save
pm2 startup
```

### Phase 5: Reverse Proxy (cPanel/WHM)

In WHM → Apache Configuration, or create `.htaccess` / Nginx proxy:

**For Apache (cPanel default):**
```apache
# /home/your_cpanel_user/public_html/.htaccess
RewriteEngine On
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
ProxyPassReverse / http://127.0.0.1:3000/
```

**For Nginx (if installed):**
```nginx
server {
    listen 443 ssl;
    server_name ebic.cit.edu.ly;

    # SSL handled by cPanel AutoSSL
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /_next/static {
        alias /home/your_cpanel_user/apps/ebic/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        alias /home/your_cpanel_user/apps/ebic/public;
        expires 1y;
    }
}
```

### Phase 6: SSL & Domain

```bash
# Option A: cPanel AutoSSL (automatic)
# Go to cPanel → SSL/TLS Status → Run AutoSSL

# Option B: Let's Encrypt
certbot --nginx -d ebic.cit.edu.ly
```

### Phase 7: Verify

```bash
# Check PM2 is running
pm2 status

# Check app health
curl -I https://ebic.cit.edu.ly

# Check logs
pm2 logs ebic-app --lines 50

# Monitor resources
pm2 monit
```

---

## 💰 Cheapest Hosting Strategy

| Option | Monthly Cost | RAM | Verdict |
|---|---|---|---|
| **cPanel Shared Hosting** | $3-10 | 256MB shared | ❌ Not viable |
| **DigitalOcean Basic 2GB** | $12 | 2GB | ✅ Minimum viable |
| **Hetzner CX22** | €4.5 (~$5) | 4GB | ✅ Best value |
| **Contabo VPS S** | €5.99 | 8GB | ✅ Most resources per $ |
| **OVH VPS Starter** | $6 | 2GB | ✅ Good option |
| **Existing VPS with cPanel** | Varies | Check specs | ✅ If ≥2GB RAM |

> [!TIP]
> **Best value**: Hetzner CX22 at ~$5/month gives 4GB RAM, 2 vCPU, 40GB SSD. Install cPanel/WHM if needed, or use Coolify/CapRover for easier container management.

---

## 📊 Recommended Environment Variables

```env
# === CRITICAL (App won't start without these) ===
DATABASE_URL=mysql://ebic_user:STRONG_PASSWORD@localhost:3306/citcoder_eitdc?connection_limit=5
NEXTAUTH_SECRET=<64-char random string>
NEXTAUTH_URL=https://ebic.cit.edu.ly
AUTH_SECRET=${NEXTAUTH_SECRET}
AUTH_URL=${NEXTAUTH_URL}
AUTH_TRUST_HOST=true
NEXT_PUBLIC_APP_URL=https://ebic.cit.edu.ly
ADMIN_API_KEY=<32-char random string>
INIT_ADMIN_EMAIL=admin@cit.edu.ly
INIT_ADMIN_PASSWORD=<strong password>

# === EMAIL (Required for registrations) ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ebic@cit.edu.ly
SMTP_PASS=<app-specific password>
EMAIL_FROM=ebic@cit.edu.ly
EMAIL_TOKEN_SECRET=<32-char hex>

# === STORAGE (Required for uploads) ===
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
S3_BUCKET_NAME=ebic-media
S3_ENDPOINT=               # Empty for AWS S3
S3_PUBLIC_ACCESS=true

# === OPTIONAL (App runs without these) ===
# REDIS_URL=redis://localhost:6379    # Optional if Redis fallback implemented
# GOOGLE_CLIENT_ID=                   # Only if Google login needed
# GOOGLE_CLIENT_SECRET=
# WHATSAPP_API_URL=                   # Only if WhatsApp integration needed
# WHATSAPP_API_TOKEN=
# CDN_URL=                            # Only if CDN configured
ALLOWED_ORIGINS=https://ebic.cit.edu.ly

# === PUBLIC INFO ===
NEXT_PUBLIC_CONTACT_EMAIL=ebic@cit.edu.ly
NEXT_PUBLIC_CONTACT_PHONE=+218-XXX-XXXXXXX
NEXT_PUBLIC_CONTACT_LOCATION=Misurata, Libya
NEXT_PUBLIC_WORKING_HOURS=Sun-Thu 8:00-16:00
NEXT_PUBLIC_INNOVATORS_THRESHOLD=3
NEXT_PUBLIC_COLLABORATORS_THRESHOLD=3
NEXT_PUBLIC_FAQ_THRESHOLD=1
```

---

## 📊 Post-Launch Monitoring Plan

| What to Monitor | How | Alert Threshold |
|---|---|---|
| App process alive | PM2 auto-restart | On crash (automatic) |
| Memory usage | `pm2 monit` / cron script | >80% of limit (>400MB) |
| MySQL connections | `SHOW PROCESSLIST` cron | >8 active connections |
| Disk space | `df -h` cron | >80% used |
| SSL certificate | cPanel AutoSSL | 7 days before expiry |
| HTTP response | External uptime monitor (UptimeRobot - free) | >5s response or 5xx |
| Error logs | `pm2 logs` + log rotation | Any unhandled rejection |

**PM2 log rotation:**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## Execution Priority

| Priority | Task | Effort |
|---|---|---|
| 🔴 P0 | Delete test auth route | 1 min |
| 🔴 P0 | Fix MAX_FILE_SIZE (50GB → 50MB) | 1 min |
| 🔴 P0 | Add security headers to next.config.ts | 15 min |
| 🔴 P1 | Make Redis optional (graceful fallback) | 1-2 hours |
| 🔴 P1 | Add in-memory rate limit fallback | 30 min |
| 🔴 P1 | Add connection_limit to DATABASE_URL docs | 5 min |
| 🟡 P2 | Eliminate worker for low-resource mode | 30 min |
| 🟡 P2 | Add image cache TTL configuration | 5 min |
| 🟡 P2 | Update social media links | 5 min |
| 🟢 P3 | Remove console.logs from registration pages | 10 min |
| 🟢 P3 | Add CORS middleware to Hono routes | 20 min |

**Total estimated effort for production-ready state**: ~4-5 hours

Should I proceed with executing the P0 and P1 fixes?
