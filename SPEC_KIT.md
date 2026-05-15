# SPEC_KIT — EBIC Platform System Analysis & Architecture

**Entrepreneurship and Business Incubators Center — Misurata**
**Analysis Date:** May 15, 2026
**Analyst:** Principal Architect

---

## 1. System Architecture (Layers)

The EBIC platform uses a decoupled, hybrid architecture optimized for containerization and performance.

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| **Proxy / Web Server** | Nginx | SSL termination, reverse proxying, rate limiting. |
| **Framework / Rendering** | Next.js 16 (App Router) | Server-side rendering, React Server Components (RSC) for public routes, and Client Components for interactive admin features. |
| **API Gateway** | Hono.js | Lightweight edge-compatible routing for all `/api/[[...route]]` endpoints. Integrates seamlessly with Next.js App Router. |
| **Database ORM** | Prisma 7 | Type-safe schema definitions, database migrations, and adapter-based connection to MariaDB/MySQL. |
| **Database** | MySQL 8.0 | Primary relational data store for content, users, and transactions. |
| **Cache Layer** | Redis 7 + LRU Memory | Dual-tier caching strategy. Redis serves as primary, falling back to LRU in-memory caching. |
| **Queue / Workers** | BullMQ | Background asynchronous task processing (Email, WhatsApp, Token Cleanup, Report Generation). |
| **Storage** | S3 (MinIO / AWS / Cloudflare R2) | Blob storage for Innovator/Collaborator media and project files. |
| **Auth & Security** | NextAuth.js v5 | JWT-based session strategy with RBAC token injection and 2FA bypass logic. |

---

## 2. Data Flows

### Innovator Registration Flow
1. **Client**: Multi-step wizard submits FormData to `/api/innovators`.
2. **Hono Route**: Parses and validates data using Zod (including `sanitizeHtml`).
3. **Pre-flight Checks**: Checks DB for duplicate email/phone.
4. **Blob Storage**: Uploads images and project files to S3 *outside* the database transaction.
5. **Database Transaction**:
   - Create `Image` record.
   - Create `Innovator` record.
   - Create `InnovatorProjectFile` relationships.
6. **Error Handling**: If DB transaction fails, trigger `s3Service.deleteFile` to rollback orphaned blobs.
7. **Side Effects**: BullMQ queue triggers admin notifications and confirmation emails. Cache `innovators:public` is invalidated.

### Collaborator Registration Flow
Identical pattern to Innovators, utilizing a four-step wizard to gather company information, industry expertise, and required media attachments. Relies on the same S3 pre-upload and DB transaction logic.

### FAQ Visibility Flow
1. **Source**: Seeded via `prisma/seed-faqs.ts` with `isActive: true`.
2. **Cache layer**: `/api/faqs/public` route requests data via `cache.getOrSet('faqs:public')`.
3. **Database**: Fetcher queries Prisma for active FAQs ordered by `isSticky` and `order`.
4. **Invalidation**: Admin edits/deletions trigger `cache.del('faqs:public')` strictly guaranteeing visibility state changes.

---

## 3. RBAC Design

The RBAC implementation combines database persistence with JWT session optimization.

- **Resources**: Defined in `src/lib/rbac-base.ts` (e.g., USERS, NEWS, COLLABORATORS, DASHBOARD).
- **Actions**: CRUD operations + MANAGE, APPROVE, REJECT.
- **Roles**: 
  - `super_admin` (All access)
  - `admin` (Content + Workflow approval)
  - `news_editor` (News CRUD)
  - `request_reviewer` (Innovator/Collaborator approval)
  - `viewer` (Read-only dashboard access)
- **Checking Permissions**:
  - *Synchronous*: Edge proxy and API endpoints verify permissions injected into the JWT session using `checkPermission`.
  - *Asynchronous*: Core mutative actions (like creating invitations) query the database using `hasPermission`.

---

## 4. API Structure

All API routes are consolidated under a Hono catch-all route at `src/app/api/[[...route]]/route.ts`. 
Feature-specific APIs are modularized:
- `src/features/innovators/server/route.ts`
- `src/features/collaborators/server/route.ts`
- `src/features/faqs/server/route.ts`
- `src/features/auth/server/route.ts`

Each module exports an isolated Hono instance, which is aggregated at the root.

---

## 5. Caching Strategy

The caching mechanism (`src/lib/cache.ts`) utilizes a dual-tier system:
1. **Redis**: Primary cache for all clustered/production environments.
2. **LRU In-Memory**: Fallback cache for local development or when Redis connection fails.

**Warning**: `getOrSet` operations currently lack a SETNX mutex lock, exposing the system to potential cache stampedes on TTL expiry. (Targeted for resolution in the Fix Plan).

---

## 6. Queue System (BullMQ)

The queue system isolates heavy, blocking tasks from the main Node.js event loop:
- **Workers**: Managed in `src/worker.ts` and loaded dynamically.
- **Jobs**:
  - `email-queue`: Transactional emails via Nodemailer.
  - `whatsapp-queue`: Integration with external WhatsApp APIs.
  - `report-queue`: PDF/CSV generation for admin analytics.
  - `token-cleanup`: Purging expired invitation/auth tokens.

---

## 7. Storage System (S3)

The platform entirely avoids database BLOB storage in favor of S3-compatible endpoints:
- Configured via `src/lib/storage/s3-service.ts`.
- Environment driven (MinIO locally, AWS S3 / Cloudflare R2 in production).
- Strict MIME type validations (`image/jpeg`, `application/pdf`, etc.) and a hard 10MB payload limit are enforced on the server prior to upload.
