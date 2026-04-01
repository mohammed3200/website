# Architecture Rules

## Boundary Constraints
1. **UI Layer**: Only React Server Components (RSC) and Client Components (`"use client"`). Directly talks to API via `src/proxy.ts` (Hono RPC client). Database access is strictly prohibited in the UI components layer.
2. **API Layer**: Hono.js mounts onto `/api/[[...route]]/route.ts`. All endpoints must be registered within localized sub-routers under `src/features/[domain]/server/route.ts`. 
3. **Data Layer**: Prisma singleton (`src/lib/db.ts`) handles MySQL 8.0 interactions. S3 handles media (`src/lib/storage/s3-service.ts`).

## Transaction & Rollback Pattern
For mutations involving external systems (e.g., S3):
1. Execute structural file validations first.
2. Upload files to S3 via presigned mechanisms. Receive S3 keys.
3. Execute `db.$transaction` to mutate Prisma schema.
4. **ROLLBACK**: If the DB transaction throws, catch the error, run `await Promise.allSettled(uploadedS3Keys.map(key => s3Service.deleteFile(key)))`, and rethrow the 500 status.
5. Do NOT execute DB writes before S3 uploads in paths that leave orphaned DB states if network failures occur on S3 side.

## Dependency Directions
- `src/features/*` encapsulate their own components, schemas, servers, and hooks. 
- Features can import from `src/lib/*` and `src/components/ui/*` (shared). 
- Features should almost never cross-import other features directly to prevent circular dependencies. Use shared Event / Notification queues if needed.
