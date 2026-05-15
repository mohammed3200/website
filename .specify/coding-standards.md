# EBIC Platform Coding Standards & Specifications

## 1. File Structure Rules
- **Domain-Driven Design:** All domain logic must reside in `src/features/{feature-name}/`.
  - Sub-directories: `api/` (React Query hooks), `components/` (UI fragments), `server/` (Hono API routes), `schemas/` (Zod definitions).
- **Shared Components:** Generic UI elements reside in `src/components/ui/` (shadcn pattern).
- **Core Libraries:** Singleton instances and external connections exist in `src/lib/` (e.g., `db.ts`, `redis.ts`, `s3/`).

## 2. Naming Conventions
- **Files/Folders:** kebab-case strictly (e.g., `use-get-public-faqs.ts`).
- **React Components:** PascalCase (e.g., `InnovatorFormWizard.tsx`).
- **Interfaces/Types:** PascalCase, do NOT prefix with 'I' (e.g., `InnovatorProfile`).
- **Constants/Enums:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`).
- **Database Models:** PascalCase, singular (e.g., `StrategicPlan`, `Collaborator`).

## 3. API Patterns (Hono + Next.js)
- **Validation First:** ALL routes MUST validate inputs using Zod via Hono's `zValidator` middleware.
- **Sanitization:** Text inputs must be passed through `sanitizeHtml()` before touching the ORM.
- **S3 Transaction Pattern:**
  1. Upload assets to S3.
  2. Execute Prisma `$transaction`.
  3. If `$transaction` throws, catch error and aggressively issue `s3Service.deleteFile` on orphaned assets.
- **Response Structure:** APIs must return predictable JSON schemas.
  - Success: `{ data: ... }`
  - Error: `{ error: string, details?: any }`

## 4. Security Practices
- **Rate Limiting:** Public-facing endpoints (`POST /api/innovators`, `/api/collaborators`) must enforce rate limits.
- **Authentication Check:** API routes must explicitly call `verifyAuth` and `requirePermission` middleware. Do not assume authentication.
- **XSS Prevention:** React automatically handles escaping, but `dangerouslySetInnerHTML` is STRICTLY PROHIBITED unless rendering explicitly sanitized rich text from the CMS.
- **RBAC Fallback:** Verify permissions from the JWT token synchronously. For high-risk actions (inviting admins), query the DB asynchronously using `hasPermission`.

## 5. State Management & Data Fetching
- **Client State:** Multi-step wizards use `zustand` with sessionStorage persistence.
- **Server State:** `useQuery` / `useMutation` via TanStack React Query. Stale times must be explicitly defined (e.g., `staleTime: 600000`).
- **Cache Invalidation:** Always call `cache.del('key')` on the server immediately following any mutation affecting public data.
