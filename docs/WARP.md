# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a bilingual (Arabic/English) web platform for the Misurata Center for Entrepreneurship & Business Incubators, built with Next.js 16, TypeScript, Prisma, and MySQL. The platform features automatic internationalization, role-based access control (RBAC), and an admin dashboard for managing content and submissions.

## Development Commands

### Package Manager
This project uses **pnpm** (specified in `package.json` as `packageManager`). Use pnpm commands:

### Core Commands
```powershell
# Development server (runs on http://localhost:3000)
pnpm dev

# Production build and start
pnpm build
pnpm start

# Linting
pnpm lint

# Testing
pnpm test                    # Run all tests
```

### Database Commands (Prisma)
```powershell
# Generate Prisma Client (run after schema changes)
npx prisma generate

# Run migrations in development
pnpm db:migrate              # Creates and applies new migrations

# Push schema changes directly (useful for prototyping)
pnpm db:push

# Reset database (WARNING: deletes all data)
pnpm db:reset

# Seed database with initial data
pnpm seed                    # General seed
pnpm seed:rbac              # Seed RBAC roles and permissions
```

### Database Management
```powershell
# Open Prisma Studio (database GUI)
npx prisma studio

# View current migrations
npx prisma migrate status

# Create migration without applying
npx prisma migrate dev --create-only
```

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Hono.js (API routes) + Prisma ORM
- **Database**: MySQL
- **Authentication**: NextAuth.js v5 with custom credential provider
- **Queue/Email**: BullMQ + Redis + Nodemailer/Resend
- **i18n**: next-intl (Arabic/English with automatic translation routing)
- **Testing**: Jest + React Testing Library
- **State**: TanStack Query (React Query)

### Directory Structure

```
src/
├── app/                     # Next.js App Router
│   ├── [locale]/           # Internationalized public routes (ar/en)
│   ├── admin/              # Admin dashboard (non-localized)
│   ├── api/                # API routes
│   │   ├── [[...route]]/   # Hono.js catch-all route
│   │   └── auth/           # NextAuth endpoints
│   └── auth/               # Authentication pages
├── features/               # Domain-driven feature modules
│   ├── admin/              # Admin dashboard logic
│   ├── auth/               # Authentication & RBAC
│   ├── collaborators/      # Collaborator submissions
│   ├── email/              # Email service & templates
│   ├── Faqs/               # FAQ management
│   ├── innovators/         # Innovator project submissions
│   ├── news/               # News articles
│   └── strategic-plan/     # Strategic plan content
├── components/             # Reusable UI components
├── lib/                    # Utilities (db, auth, email, security)
├── i18n/                   # Internationalization config
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── constants/              # Constants and enums
├── data/                   # Static data
└── middleware.ts           # Route guards, RBAC, and i18n
```

### Key Architectural Patterns

#### 1. Feature-Based Organization
Each domain feature (e.g., `collaborators`, `innovators`) contains:
- **API layer**: `server/route.ts` (Hono.js endpoints)
- **React Query hooks**: `api/use-*.ts` (data fetching/mutations)
- **Components**: Feature-specific UI components
- **Types**: TypeScript interfaces for the feature

#### 2. Internationalization (i18n)
- **Routing**: All public routes use `[locale]` dynamic segment (e.g., `/ar/news`, `/en/news`)
- **Default locale**: Arabic (`ar`)
- **Configuration**: `src/i18n/routing.ts`
- **Middleware**: Handles locale detection and routing
- **Translation files**: `messages/ar.json` and `messages/en.json`
- **Usage**: Use `useTranslations()` hook from `next-intl` in components

#### 3. Authentication & Authorization (RBAC)
- **Auth provider**: NextAuth.js v5 (configured in `src/features/auth/auth.ts`)
- **Session storage**: Database sessions via Prisma adapter
- **RBAC models**: `Role`, `Permission`, `RolePermission` (see `prisma/schema.prisma`)
- **Permission structure**: Resource-action pairs (e.g., `{resource: "news", action: "create"}`)
- **Middleware protection**: `src/middleware.ts` checks permissions for `/admin/*` routes
- **Token claims**: JWT tokens include `permissions` array for authorization checks

#### 4. API Architecture
- **Framework**: Hono.js (lightweight, fast alternative to Express)
- **Entry point**: `src/app/api/[[...route]]/route.ts` (catch-all route handler)
- **Route registration**: Individual features register their routes (e.g., `/api/collaborator`, `/api/innovators`)
- **Client integration**: TanStack Query hooks use `hc` (Hono client) for type-safe API calls

#### 5. Database & ORM
- **ORM**: Prisma with MySQL provider
- **Schema location**: `prisma/schema.prisma`
- **Client instance**: Singleton exported from `src/lib/db.ts` as `db`
- **Key models**:
  - **Users & Auth**: `User`, `Account`, `VerificationToken`, `PasswordResetToken`, `TwoFactorToken`
  - **RBAC**: `Role`, `Permission`, `RolePermission`, `UserInvitation`
  - **Content**: `News`, `Innovator`, `Collaborator`, `Image`, `Media`
  - **Email**: `EmailLog`, `EmailTemplate`, `EmailQueue`, `EmailAction`

#### 6. Email System
- **Queue**: BullMQ with Redis for async email processing
- **Templates**: Handlebars templates in React Email format (`src/lib/email/templates/`)
- **Tracking**: `EmailLog` model tracks delivery status, opens, clicks, bounces
- **Service**: Centralized in `src/lib/email/service.ts`
- **Actions**: Email-based actions (approve/reject) with token validation

#### 7. Status Workflow
- **Submission status**: `PENDING` → `APPROVED` / `REJECTED` / `ARCHIVED`
- **Email notifications**: Automated emails sent on status changes
- **Visibility control**: `isVisible` boolean controls public display of approved items

### Database Schema Highlights

**Status Enums:**
```typescript
RecordStatus: PENDING | APPROVED | REJECTED | ARCHIVED
StageDevelopment: STAGE | PROTOTYPE | DEVELOPMENT | TESTING | RELEASED
EmailStatus: PENDING | SENT | DELIVERED | FAILED | BOUNCED
InvitationStatus: PENDING | ACCEPTED | EXPIRED | CANCELLED
```

**Critical Relationships:**
- User → Role (many-to-one)
- Role → Permissions (many-to-many via `RolePermission`)
- Collaborator/Innovator → EmailLog (one-to-many for tracking)
- User invitations tracked via `UserInvitation` model

### Middleware Flow

1. **Static/API bypass**: Skip middleware for `/_next`, `/api`, static files
2. **Auth routes** (`/auth/*`): Redirect if already authenticated
3. **Admin routes** (`/admin/*`): Require authentication + dashboard permissions
4. **Root path** (`/`): Redirects to preferred locale
5. **Localized routes** (`/[locale]/*`): Handled by next-intl middleware

### Path Aliases
TypeScript path alias configured: `@/*` maps to `./src/*`

Example: `import { db } from "@/lib/db"`

## Development Workflows

### Adding a New Feature
1. Create feature directory in `src/features/`
2. Add Prisma models if needed, then run `pnpm db:migrate`
3. Create Hono route in `server/route.ts`
4. Register route in `src/app/api/[[...route]]/route.ts`
5. Create React Query hooks in `api/use-*.ts`
6. Build UI components
7. Add translations to `messages/ar.json` and `messages/en.json`

### Modifying Database Schema
1. Edit `prisma/schema.prisma`
2. Run `pnpm db:migrate` to create and apply migration
3. Run `npx prisma generate` to update Prisma Client
4. Update TypeScript types if needed

### Running Tests
```powershell
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run specific test file
pnpm test path/to/file.test.ts
```

### Testing Configuration
- **Framework**: Jest with ts-jest preset
- **Environment**: jsdom (for React component testing)
- **Setup**: `jest.setup.ts` imports `@testing-library/jest-dom`
- **Config**: `jest.config.ts`

### Email Testing
Email templates are tested using the scripts in `scripts/test-email-templates.ts`

### Environment Variables
Key environment variables required (see `.env`):
- `DATABASE_URL`: MySQL connection string
- `NEXTAUTH_SECRET`: NextAuth.js secret for JWT signing
- `NEXTAUTH_URL`: Base URL for authentication callbacks
- `REDIS_URL`: Redis connection for BullMQ
- Email provider credentials (SMTP or Resend API key)

## Code Patterns & Conventions

### TypeScript
- **Strict mode enabled**: `noImplicitAny`, `strictNullChecks`
- **Naming**: Use descriptive variable names; underscore prefix (`_`) for unused params
- **Avoid `any`**: Prefer explicit types or `unknown`

### ESLint Rules
- No console.log (use console.warn or console.error)
- Unused vars/imports trigger errors (except underscore-prefixed)
- React hooks deps warnings enabled

### Component Patterns
- Use functional components with TypeScript
- Prefer composition over prop drilling
- Use `"use client"` directive for client components in App Router
- Server components by default (no directive needed)

### Data Fetching
- **Server components**: Direct Prisma queries via `db` instance
- **Client components**: TanStack Query hooks with Hono client
- Always handle loading and error states

### Forms
- Use `react-hook-form` with Zod validation
- Form components: Radix UI primitives + Tailwind

### Styling
- Tailwind CSS utility classes
- `tailwind-vanilla-rtl` for RTL support (Arabic)
- Component variants via `class-variance-authority`
- Utility function: `cn()` from `lib/utils` for conditional classes

## Important Constraints

### Localization
- All user-facing content must have Arabic and English translations
- Admin dashboard (`/admin/*`) is not localized
- Use translation keys, not hardcoded strings

### Security
- Never expose secrets in code or logs
- Admin routes are protected by middleware + RBAC
- All user input must be validated (Zod schemas)
- Passwords hashed with bcrypt

### Performance
- Images stored as binary in database (`Image` and `Media` models use MySQL BLOB types)
- Use `@db.Text` or `@db.LongText` for large string fields
- Prisma queries should be optimized with proper indexes

### Database
- Use transactions for operations that modify multiple tables
- Always run `npx prisma generate` after schema changes
- Migration names should be descriptive

### Testing
- Write tests for all new utilities and complex logic
- Use meaningful test descriptions
- Mock external dependencies (email, Redis)

## Common Pitfalls

1. **Forgetting to run `npx prisma generate`** after schema changes → leads to type errors
2. **Not handling both locales** → breaks i18n experience
3. **Hardcoding strings** instead of using translations
4. **Bypassing middleware** → security vulnerabilities in admin routes
5. **Not checking RBAC permissions** in API routes → authorization bypass
6. **Running database commands without migrations** → schema drift

## Additional Resources

- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js 16 Docs**: https://nextjs.org/docs
- **Hono.js Docs**: https://hono.dev
- **TanStack Query**: https://tanstack.com/query
- **next-intl**: https://next-intl-docs.vercel.app

## Access Points

- **Public site**: http://localhost:3000 (redirects to locale)
- **Admin login**: http://localhost:3000/auth/login
- **Admin dashboard**: http://localhost:3000/admin/dashboard
- **Prisma Studio**: http://localhost:5555 (after running `npx prisma studio`)

## Deployment Notes

This is a Windows development environment (PowerShell). When deploying to production:
- Ensure MySQL and Redis are accessible
- Set all required environment variables
- Run `pnpm build` before starting
- Consider using `pm2` or similar for process management
- Enable database connection pooling for production loads
