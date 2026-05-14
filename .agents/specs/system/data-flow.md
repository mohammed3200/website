# Data Flow Mechanics

## 1. Client Submission Flow
1. **Input**: User clicks "Submit". `react-hook-form` runs local `zod` schema to ensure client-side parity.
2. **Transport**: RPC client wrapped around `AppType` (Hono) sends exactly typed payload to API.
3. **Gateway**: Hono `zValidator` runs the identical / mirrored server schema. 
4. **Mutation**: Hono core handler processes S3 uploads and Prisma statements.
5. **Async Offloading**: Success event drops a notification to the Admins + an email task to Redis/BullMQ.
6. **Response**: JSON-RPC standard success code (`{ success: true }` or `{ message: ... }`).
7. **Cache Invalidations**: Hono handler deletes/updates Redis cache (`cache.del('key')`). Client component invalidates its TanStack/React state, routes to success page.

## 2. Server Fetch Flow (RSCs)
1. Next.js Server Component accesses DB directly via `const data = await db.model.findMany()`. 
2. Wait, DO NOT directly access DB from UI. EBIC uses standard TanStack Query integrated with the Hono RPC client (`client.api.admin.stats.$get()`) fetched client-side, OR server-side proxy hydration.
3. Observe RBAC enforcement: the Hono endpoint ALWAYS checks `auth()` session and evaluates `checkPermission(session.user.permissions)`.

## 3. Global Error Handling
Hono's `app.onError` traps standard errors mapping them to standard JSON RPC Error objects:
`{ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' } }`. Domain-specific violations must return HTTP 400 with a strict JSON code: `{ code: 'EMAIL_EXISTS', message: '...' }` before the global boundary catches them.
