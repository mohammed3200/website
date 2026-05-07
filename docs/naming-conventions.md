# EBIC Platform Naming Conventions

To ensure consistency and maintainability across the EBIC Platform codebase, we adhere to the following naming conventions.

## 1. File Naming
- **Format**: All file names must use `kebab-case` (lowercase words separated by hyphens).
- **Examples**:
  - Components: `home-hero.tsx`, `card-innovators.tsx`, `nav-bar.tsx`
  - Hooks: `use-get-public-collaborators.ts`, `use-auth.ts`
  - Utilities: `date-utils.ts`, `string-helpers.ts`
  - API Routes: `route.ts` (Next.js/Hono standard)

*Note: During active development, we are deferring actual renames of legacy files (e.g., `CardCompanies.tsx`, `Hero.tsx`) to avoid breaking imports. All new files must follow the `kebab-case` convention.*

## 2. Exports
- **Format**: 
  - React Components and classes should be exported using `PascalCase`.
  - Functions, hooks, and variables should be exported using `camelCase`.
- **Examples**:
  - Components: `export const HomeHero = () => ...`, `export default function CardInnovators() ...`
  - Hooks: `export const useGetPublicCollaborators = () => ...`
  - Utilities: `export const formatDate = () => ...`

## 3. Database Schema
- **Format**: Database fields and keys must use `camelCase`.
- **Examples**: `userId`, `imageId`, `createdAt`, `updatedAt`

## 4. Storage Uploads
- **Format**: Files uploaded to storage (S3/MinIO) should follow a specific format to avoid collisions and maintain traceability.
- **Example**: `[entityType]-[uuid].[ext]`
  - `collaborator-123e4567-e89b-12d3-a456-426614174000.png`
  - `innovator-123e4567-e89b-12d3-a456-426614174000.pdf`

## 5. Environment Variables
- **Format**: All environment variables should use `UPPER_SNAKE_CASE`.
- **Examples**: `DATABASE_URL`, `NEXT_PUBLIC_API_URL`, `REDIS_URL`

By following these conventions, we ensure a clean, readable, and predictable codebase structure.
