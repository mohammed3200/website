# SPEC_KIT — EBIC Platform System Analysis

**Entrepreneurship and Business Incubators Center — Misurata**
**Analysis Date:** April 29, 2026
**Analyst:** System Audit (Principal Architect Level)

---

## 1. Project Overview

### What is this system?
EBIC is a bilingual (Arabic/English) web platform for the **Center for Leadership and Business Incubators** at the **College of Industrial Technology — Misurata, Libya**. It serves as the digital hub for managing:
- Collaborator (company) registrations for industry partnerships
- Innovator/creator registrations for incubation programs
- News and announcements
- Strategic plans
- FAQ management
- CMS content for entrepreneurship and incubator pages

### Business Purpose
Bridge academic excellence with industrial expertise by providing a structured platform for companies to register as collaborating partners and for innovators to submit their projects for incubation.

### Target Users
| User Type | Description |
|-----------|-------------|
| **Public Visitors** | Browse news, FAQs, strategic plans, partner/innovator listings |
| **Collaborators** | Companies registering to partner with the center |
| **Innovators** | Individuals submitting projects/ideas for incubation |
| **Admins** | Platform managers who review submissions, manage content |
| **Super Admins** | Full system control including user management and settings |

### Main Workflows
1. **Collaborator Registration**: 4-step wizard → DB save → email notification → admin review → approve/reject
2. **Innovator Registration**: Multi-step form → DB save → email notification → admin review → approve/reject
3. **Content Management**: Admin creates/edits news, strategic plans, page content, FAQs, legal pages
4. **User Management**: Invitation-based admin user creation with RBAC

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.1.1 |
| **UI** | React | 19.2.3 |
| **Language** | TypeScript | 5.9.3 |
| **Styling** | Tailwind CSS | 3.4.19 |
| **Forms** | react-hook-form + Zod v4 | 7.70.0 / 4.3.5 |
| **State** | Zustand (persisted form stores) | 5.0.9 |
| **Animation** | Framer Motion | 12.23.26 |
| **API** | Hono.js (catch-all API route) | 4.11.3 |
| **Auth** | NextAuth.js v5 (beta.30) | 5.0.0-beta.30 |
| **ORM** | Prisma 7 | 7.4.0 |
| **Database** | MySQL 8.0 (prod) / MariaDB (legacy) | — |
| **Queue** | BullMQ + ioredis | 5.66.4 |
| **Storage** | AWS S3 / MinIO / Cloudflare R2 | — |
| **Email** | Nodemailer + React Email | 7.0.12 |
| **i18n** | next-intl | 4.7.0 |
| **Data Fetching** | TanStack React Query | 5.90.16 |
| **Tables** | TanStack React Table | 8.21.3 |
| **Charts** | Recharts | 3.7.0 |
| **UI Components** | Radix UI primitives + shadcn/ui pattern | Multiple |
| **Icons** | Lucide React + Tabler Icons | — |
| **Package Manager** | Bun (lockfile) / pnpm (packageManager field) | 1.3.x |
| **Testing** | Bun Test + Testing Library | — |
| **Deployment** | Docker (standalone output) + nginx reverse proxy | — |

---

## 3. Architecture

### Frontend ↔ Backend Communication
```text
Browser → Next.js App Router
  ├── Server Components (direct DB access via Prisma)
  ├── Client Components → Hono.js API (/api/[[...route]])
  │     ├── /api/collaborator
  │     ├── /api/innovators
  │     ├── /api/admin/*
  │     ├── /api/news
  │     ├── /api/faqs
  │     ├── /api/legal-content
  │     ├── /api/pageContent
  │     ├── /api/strategicPlan
  │     └── /api/users
  └── Server Actions (auth login/register)
```

### Data Flow
1. **Public pages**: Server Components fetch directly from Prisma (no API round-trip)
2. **Admin dashboard**: Client Components use TanStack Query → Hono API → Prisma
3. **Registration forms**: Zustand store (sessionStorage persistence) → FormData POST to Hono API → Prisma + S3 upload → BullMQ email queue

### Auth Flow
```text
User visits /admin
  → proxy.ts middleware checks JWT token via getToken()
  → No token → redirect to /auth/login?callbackUrl=/admin
  → Has token → check dashboard:read permission
  → No permission → redirect to /auth/error?error=AccessDenied
  → Has permission → NextResponse.next()
```

### Registration Flow (Collaborator)
```text
/[locale]/collaborators/registration/[step]
  → CollaboratorFormWizard (client component)
  → useFormController hook manages step navigation
  → Zustand store persists data to sessionStorage
  → Step validation via Zod schemas (per-step)
  → Final submit: FormData POST to /api/collaborator
  → Server: validate → upload image to S3 → save to DB → queue email
  → Redirect to /collaborators/registration/complete
```

### Admin Dashboard Structure
```text
/admin (dashboard page with stats, charts, activity feed)
├── /admin/submissions (review innovator/collaborator applications)
├── /admin/news (CRUD news articles)
├── /admin/faqs (CRUD FAQ entries)
├── /admin/content (manage entrepreneurship/incubators page content)
├── /admin/strategic-plans (CRUD strategic plans)
├── /admin/users (user management)
├── /admin/settings (notification preferences, legal content editor)
├── /admin/notifications (notification history)
├── /admin/reports (generate/download reports)
└── /admin/templates (message template management)
```

### RBAC System
Permission-based access control using `Role → RolePermission → Permission` chain.
- Resources: users, news, collaborators, innovators, dashboard, settings, invitations, content, templates, messages, reports, strategic_plans
- Actions: create, read, update, delete, manage, invite, approve, reject
- `checkPermission()` is a pure function safe for Edge Middleware

---

## 4. Folder Structure

| Directory | Responsibility |
|-----------|---------------|
| `src/app` | Next.js App Router pages and layouts |
| `src/app/(dashboard)` | Admin dashboard and auth routes (no locale prefix) |
| `src/app/[locale]` | Public-facing localized pages (ar/en) |
| `src/app/api` | API route handler (Hono catch-all + health + NextAuth) |
| `src/features/` | Feature-based modules (12 total) |
| `src/features/auth` | NextAuth config, login form, server actions |
| `src/features/collaborators` | Registration wizard, schemas, API, components |
| `src/features/innovators` | Registration form, schemas, API, components |
| `src/features/admin` | Dashboard components, hooks, API, middleware |
| `src/features/news` | News CRUD, API |
| `src/features/faqs` | FAQ management, API |
| `src/features/legal-content` | Terms/Privacy CMS, viewer, editor |
| `src/features/strategic-plan` | Strategic plan management |
| `src/features/page-content` | CMS for entrepreneurship/incubators pages |
| `src/features/email` | Email service, templates |
| `src/features/users` | User management API |
| `src/features/whatsapp` | WhatsApp integration (partial) |
| `src/lib/` | Shared utilities and infrastructure |
| `src/lib/forms/` | Generic multi-step form system (store, controller, components) |
| `src/lib/rbac.ts` | RBAC system (roles, permissions, initialization) |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/redis.ts` | Redis/ioredis connection |
| `src/lib/queue/` | BullMQ queue configuration |
| `src/lib/storage/` | S3/MinIO file storage service |
| `src/lib/email/` | Email service (Nodemailer) |
| `src/components/` | Shared UI components (shadcn/ui pattern) |
| `src/i18n/` | Internationalization configuration |
| `src/data/` | Data access layer (user, account, tokens) |
| `prisma/` | Database schema, migrations, seed scripts |
| `messages/` | Locale translation files (ar.json, en.json) |
| `docker/` | Docker-related files |
| `deploy/` | Deployment scripts |
| `nginx/` | Reverse proxy configuration |
| `tests/` | Test files |
| `scripts/` | Utility scripts (RBAC verify, DB test, MinIO setup) |

---

## 5. Database Analysis

### Tables (from Prisma schema — 24 models)

| Model | Purpose | Key Relations |
|-------|---------|---------------|
| **User** | Admin/system users | → Role, Account, AdminNotification, AuditLog |
| **Account** | OAuth provider accounts | → User |
| **Role** | System roles (super_admin, admin, etc.) | → RolePermission, User |
| **Permission** | Granular permissions (resource:action) | → RolePermission |
| **RolePermission** | Join table: Role ↔ Permission | → Role, Permission |
| **UserInvitation** | Invitation-based user onboarding | → User (inviter), Role |
| **Collaborator** | Company registrations | → Image, ExperienceProvidedMedia, MachineryAndEquipmentMedia |
| **Innovator** | Innovator/creator registrations | → Image, InnovatorProjectFile |
| **News** | News articles | → Image, User (creator/updater) |
| **StrategicPlan** | Strategic plans | → Image |
| **FAQ** | Frequently asked questions | Standalone (bilingual) |
| **Image** | Image metadata (S3 references) | ← Collaborator, Innovator, News, StrategicPlan |
| **Media** | General media files (S3 references) | ← ExperienceProvidedMedia, MachineryAndEquipmentMedia, InnovatorProjectFile |
| **PageContent** | CMS content blocks | Standalone (bilingual) |
| **LegalContent** | Terms of Use / Privacy Policy | Standalone (type + locale unique) |
| **MessageTemplate** | Email/WhatsApp templates | → Message |
| **Message** | Sent messages | → MessageTemplate, User |
| **EmailLog** | Email delivery tracking | Standalone |
| **WhatsAppLog** | WhatsApp delivery tracking | Standalone |
| **AdminNotification** | In-app admin notifications | → User |
| **AuditLog** | System audit trail | → User |
| **SystemSetting** | Key-value system settings | Standalone |
| **Report** | Generated reports | Standalone |
| **VerificationToken / PasswordResetToken / TwoFactorToken / TwoFactorConfirmation** | Auth tokens | — |

### Enums
- `RecordStatus`: PENDING, APPROVED, REJECTED, ARCHIVED, UNDER_REVIEW
- `StageDevelopment`: STAGE, PROTOTYPE, DEVELOPMENT, TESTING, RELEASED
- `AuditAction`: CREATE, UPDATE, DELETE, APPROVE, REJECT, ARCHIVE, LOGIN, LOGOUT
- `EmailStatus`: SENT, FAILED
- `Channel`: EMAIL, WHATSAPP, BOTH
- `Direction`: INBOUND, OUTBOUND
- `MessageStatus`: QUEUED, SENT, DELIVERED, READ, FAILED
- `LegalContentType`: privacy, terms
- `LegalContentLocale`: en, ar
- `ReportType / ReportFormat / ReportStatus / NotificationPriority`

---

## 6. Roles & Permissions

| Role | Dashboard | Users | News | Collaborators | Innovators | Settings | Invitations | Content | Templates | Messages | Reports | Strategic Plans |
|------|-----------|-------|------|---------------|------------|----------|-------------|---------|-----------|----------|---------|----------------|
| **super_admin** | MANAGE | MANAGE | MANAGE | MANAGE | MANAGE | MANAGE | MANAGE | MANAGE | MANAGE | MANAGE | MANAGE | MANAGE |
| **admin** | READ | READ+INVITE | MANAGE | MANAGE | MANAGE | — | CREATE+READ | MANAGE | READ | MANAGE | READ | MANAGE |
| **news_editor** | READ | — | CRUD | — | — | — | — | — | — | — | — | — |
| **request_reviewer** | READ | — | — | READ+APPROVE+REJECT | READ+APPROVE+REJECT | — | — | — | — | READ | — | — |
| **viewer** | READ | — | READ | READ | READ | — | — | — | — | — | — | — |

**Note:** There are no "guest", "user", "collaborator", or "innovator" roles in the RBAC system. The roles above are strictly for admin dashboard access. Public users (collaborators, innovators) are **not** User model entities — they are stored in separate `Collaborator` and `Innovator` tables.

---

## 7. Registration System (CRITICAL)

### Collaborator Registration — Full Flow

**Steps:** company-info → industry-info → capabilities → review

1. **URL**: `/{locale}/collaborators/registration/{step-id}`
2. **Component**: `CollaboratorFormWizard` → `useFormController` hook
3. **State**: Zustand store (`useCollaboratorFormStore`) with sessionStorage persistence
4. **Validation**: Per-step Zod schemas (`step1Schema` through `step4Schema`)
5. **Navigation**: `nextStep()` validates current step → advances index → pushes URL
6. **URL Sync**: Page component validates step ID → wizard syncs via `useEffect`
7. **Submission**: Final step calls `config.onComplete()` → FormData POST to `/api/collaborator`
8. **Server**: Validates → uploads image to S3 → creates Collaborator record → queues confirmation email + admin notification
9. **Success**: Redirects to `/collaborators/registration/complete`

**Step 1 (Company Info) fields:**
- companyName (required), email (required), primaryPhoneNumber (required)
- optionalPhoneNumber, location, site, image (all optional)

**Step 2 (Industry Info) fields:**
- industrialSector (required enum), specialization (required)

**Step 3 (Capabilities) fields:**
- experienceProvided, experienceProvidedMedia (files), machineryAndEquipment, machineryAndEquipmentMedia (files)

**Step 4 (Review & Terms):**
- TermsOfUse (required boolean, must be true)

### Innovator Registration — Full Flow

Similar multi-step architecture with fields:
- Personal info: name, phone, email, country, city, educationLevel, fieldOfStudy, workExperience
- Project: projectTitle, projectDescription, objective, stageDevelopment
- Files: projectFiles (up to 10), image
- Terms: TermsOfUse

### Form Library Architecture
```text
createFormStore<T>()      → Zustand store factory with persistence
useFormController<T>()    → Hook that orchestrates validation, navigation, submission
FormConfig<T>             → Steps array with schemas, components, handlers
StepLayout                → Shared UI with Next/Back buttons and error display
RegistrationLayout        → Progress indicator + step content wrapper
```

---

## 8. Authentication System

### Protection Layers

1. **Edge Middleware** (`src/proxy.ts`): Runs on every request
   - Skips `/_next`, `/api`, static files
   - `/auth/*`: If authenticated with dashboard access → redirect to `/admin/dashboard`
   - `/admin/*`: No token → redirect to `/auth/login?callbackUrl=...`; no permission → redirect to `/auth/error`
   - `/`: Redirects to preferred locale
   - All other routes: Handled by `next-intl` middleware

2. **Client-side Guard** (`useAdminAuth` hook): In admin layout
   - Checks session status
   - Unauthenticated → redirect to `/auth/login`
   - No dashboard permission → redirect to `/`

3. **API Middleware** (`verifyAuth` + `requirePermission`): Hono middleware
   - Checks NextAuth session OR API key header
   - Permission-based route protection

### Session Strategy
- JWT-based (not database sessions)
- 2-hour max age
- Permissions cached in JWT token (refreshed on signIn/update)
- `trustHost: true` for reverse proxy compatibility

---

## 9. Admin Dashboard Modules

| Module | Route | Status |
|--------|-------|--------|
| Dashboard Overview | `/admin` | ✅ Working (stats, charts, activity) |
| Submissions Review | `/admin/submissions` | ✅ Working (approve/reject with email) |
| News Management | `/admin/news` | ✅ Working (CRUD with image upload) |
| FAQ Management | `/admin/faqs` | ✅ Working (CRUD, bilingual) |
| Content Management | `/admin/content` | ✅ Working (entrepreneurship/incubators CMS) |
| Strategic Plans | `/admin/strategic-plans` | ✅ Working (CRUD) |
| User Management | `/admin/users` | ✅ Working (list, invite, role assignment) |
| Notifications | `/admin/notifications` | ✅ Working (list, mark read, preferences) |
| Reports | `/admin/reports` | ✅ Working (generate, download PDF/CSV) |
| Settings | `/admin/settings` | ✅ Working (notification prefs, legal content editor) |
| Templates | `/admin/templates` | ✅ Working (message template management) |
| Legal Content (Terms/Privacy) | `/admin/settings` → Legal Content tab | ✅ Working |

---

## 10. Public Features

| Feature | Route | Status |
|---------|-------|--------|
| Home Page | `/[locale]` | ✅ Working |
| Entrepreneurship | `/[locale]/entrepreneurship` | ✅ Working (CMS-driven) |
| Incubators | `/[locale]/incubators` | ✅ Working (CMS-driven) |
| Collaborators List | `/[locale]/collaborators` | ✅ Working |
| Collaborator Registration | `/[locale]/collaborators/registration/[step]` | ⚠️ Bug (Next button issue) |
| Innovators List | `/[locale]/innovators` | ✅ Working |
| Innovator Registration | `/[locale]/innovators/registration` | ✅ Working |
| News | `/[locale]/News` | ✅ Working |
| Strategic Plans | `/[locale]/StrategicPlan` | ✅ Working |
| FAQ | `/[locale]/faq` | ✅ Working |
| Terms of Use | `/[locale]/terms` | ✅ Working (DB-driven with defaults) |
| Privacy Policy | `/[locale]/privacy` | ✅ Working (DB-driven with defaults) |
| Contact | `/[locale]/contact` | ✅ Working |
| Footer Links | All pages | ✅ Working (terms, privacy, FAQ, social) |

---

## 11. PROJECT_TASKS_ROADMAP.md — Audit Results

### Completed Tasks (Verified ✅)
- Task 1: Email System Templates ✅
- Task 2: Redesign Innovators Feature ✅
- Task 3: Admin Notifications ✅
- Task 4: Dashboard for Managers ✅ (Phase 1 refactored)
- Task 5: Button Designs ✅
- Task 6: Card Layouts ✅
- Task 12: Registration Form Data Persistence ✅
- Task 13: AI-Powered Form Redesign ✅
- Task 14: News Schema Alignment ✅
- Task 17: Card Design & Detail Pages ✅
- Task 20: Docker Containerization ✅
- Task 22: Home Section ✅
- Task 23: Content Strategy ✅
- Task 24: Contact Page ✅
- Task 25: Architectural Debt Elimination ✅
- Task 26: Redis Caching ✅
- Phase 2: Admin Dashboard + OTP Auth ✅

### Partially Complete (Verified 🟡)
- Task 7: Email & WhatsApp Integration 🟡 (Email done, WhatsApp pending config)

### Not Started (Verified 🔴)
- Task 8: File Naming Convention 🔴
- Task 9: WhatsApp Integration System 🔴
- Task 15/19: Project Cleanup & Component Unification 🔴

### New Tasks Added (from this audit)
- **P0**: Fix registration form Next button (company-info step)
- **P0**: Fix /admin login redirect (maintenance page issue)
- **P1**: FAQ seed data generation
- **P1**: Terms/Privacy default content seeding
- **P2**: Deployment guide update (PM2 + reverse proxy)
- **P2**: ENV files verification

---

*End of SPEC_KIT*
