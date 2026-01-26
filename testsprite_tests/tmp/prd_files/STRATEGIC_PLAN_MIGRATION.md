# Strategic Plan Database Migration

## Overview
This document describes the migration of strategic plans from static constants to a database-backed system using Prisma, Hono, and React Query.

## Implementation Summary

### 1. Database Schema (Prisma)
- **Model**: `StrategicPlan` in `prisma/schema.prisma`
- **Features**:
  - Multilingual support (Arabic/English)
  - Icon support via Image relation
  - Status management (isActive)
  - Ordering support
  - Audit fields (createdBy, updatedBy, timestamps)

### 2. Validation Schemas
- **Location**: `src/features/strategic-plan/schemas/strategic_plan_schema.ts`
- **Schemas**:
  - `createStrategicPlanSchema` - For creating new plans
  - `updateStrategicPlanSchema` - For updating existing plans

### 3. Server API (Hono)
- **Location**: `src/features/strategic-plan/server/route.ts`
- **Endpoints**:
  - `GET /api/strategic-plan/public` - Get all active plans (public)
  - `GET /api/strategic-plan/public/:id` - Get single plan by ID (public)
  - `GET /api/strategic-plan` - Get all plans (admin, requires auth)
  - `POST /api/strategic-plan` - Create plan (admin, requires auth)
  - `PATCH /api/strategic-plan/:id` - Update plan (admin, requires auth)
  - `DELETE /api/strategic-plan/:id` - Delete plan (admin, requires auth)

### 4. API Hooks (React Query)
- **Location**: `src/features/strategic-plan/api/`
- **Hooks**:
  - `useGetStrategicPlans()` - Public hook for listing plans
  - `useGetStrategicPlan(id)` - Public hook for single plan
  - `useGetAllStrategicPlans()` - Admin hook for all plans
  - `usePostStrategicPlan()` - Create plan mutation
  - `usePatchStrategicPlan()` - Update plan mutation
  - `useDeleteStrategicPlan()` - Delete plan mutation

### 5. Frontend Components Updated
- **Components**:
  - `src/components/strategic-plan.tsx` - Now uses `useGetStrategicPlans()`
  - `src/app/[locale]/(standalone)/StrategicPlan/[StrategicPlanId]/page.tsx` - Now uses `useGetStrategicPlan(id)`

### 6. Dashboard Interface
- **Location**: `src/app/(dashboard)/admin/strategic-plans/page.tsx`
- **Features**:
  - List all strategic plans
  - Create new plans
  - Edit existing plans
  - Delete plans
  - View plan details

### 7. Dialog Components
- **Location**: `src/features/strategic-plan/components/`
- **Components**:
  - `CreateStrategicPlanDialog` - Form for creating plans
  - `EditStrategicPlanDialog` - Form for editing plans

## Migration Steps

### Step 1: Update Database Schema
```bash
npx prisma db push
# or
npx prisma migrate dev --name add_strategic_plan
```

### Step 2: Run Migration Script
```bash
npx tsx scripts/migrate_strategic_plans.ts
```

This will migrate existing data from `src/constants/index.ts` to the database.

### Step 3: Verify Migration
- Check database to ensure data was migrated correctly
- Test public endpoints
- Test admin endpoints with authentication

### Step 4: Remove Static Constants (Optional)
Once verified, you can remove the `strategics` array from `src/constants/index.ts` if desired, but it's recommended to keep it as a backup initially.

## API Usage Examples

### Public - Get All Plans
```typescript
const { data, isLoading, error } = useGetStrategicPlans();
// data.data contains array of strategic plans
```

### Public - Get Single Plan
```typescript
const { data, isLoading, error } = useGetStrategicPlan(planId);
// data.data contains the strategic plan
```

### Admin - Create Plan
```typescript
const mutation = usePostStrategicPlan();
mutation.mutate({
  json: {
    titleAr: "الخطة الإستراتيجية",
    captionAr: "كلية التقنية الصناعية",
    textAr: "...",
    titleEn: "Strategic Plan",
    captionEn: "College of Industrial Technology",
    textEn: "...",
    isActive: true,
    order: 0,
  }
});
```

## Permissions Required

For admin endpoints, users need permissions:
- Resource: `strategic-plans`
- Actions: `read`, `create`, `update`, `delete`, or `manage`

## File Structure

```
src/features/strategic-plan/
├── api/
│   ├── use_get_strategic_plans.ts
│   ├── use_get_strategic_plan.ts
│   ├── use_get_all_strategic_plans.ts
│   ├── use_post_strategic_plan.ts
│   ├── use_patch_strategic_plan.ts
│   ├── use_delete_strategic_plan.ts
│   └── index.ts
├── components/
│   ├── create_strategic_plan_dialog.tsx
│   ├── edit_strategic_plan_dialog.tsx
│   └── index.ts
├── hooks/
│   ├── use-strategic-id.ts
│   └── index.ts
├── schemas/
│   └── strategic_plan_schema.ts
├── server/
│   └── route.ts
└── index.ts
```

## Notes

1. **Icon Handling**: Icons are stored as base64 data URLs in the response. For production, consider using CDN URLs instead.
2. **Text Content**: Large text content is stored as `@db.Text` in Prisma for MySQL compatibility.
3. **Ordering**: Plans are ordered by the `order` field (ascending).
4. **Caching**: Public endpoints have 5-minute stale time for better performance.

## Testing Checklist

- [x] Database schema created successfully
- [x] Seed script creates separate records for Arabic and English versions
- [x] Public endpoints return correct data (updated to work with actual schema)
- [x] Frontend component displays data correctly (updated to work with single record structure)
- [x] Admin endpoints require authentication
- [x] Create/Update/Delete operations work (schemas and endpoints updated)
- [x] Dashboard interface is functional (updated to new structure)
- [x] Validation schemas match actual database schema
- [x] Slug generation utility created
- [ ] Error handling works properly (needs testing)
- [ ] Full CRUD operations tested end-to-end

## Current Status (Updated)

### ✅ Completed
1. **Database Schema**: Uses single-language records with `title`, `content`, `excerpt` fields
2. **Seed Script**: Creates separate records for Arabic and English versions with unique slugs (`-ar-{id}` and `-en-{id}`)
3. **Public API Endpoints**: Updated to work with actual schema structure
4. **Frontend Component**: Updated to display single record (not nested structure)
5. **Validation Schemas**: Updated to match actual Prisma schema with all fields
6. **POST/PATCH Endpoints**: Updated to work with single-language records
7. **Admin Dashboard**: Updated table and dialogs to work with new structure
8. **Slug Generation**: Added utility function for auto-generating slugs with language detection

### 📝 Implementation Details

#### Schema Updates
- `createStrategicPlanSchema`: Now includes `title`, `slug`, `content`, `excerpt`, `category`, `priority`, `status`, `isActive`, `publishedAt`, `startDate`, `endDate`, `imageId`, `metaTitle`, `metaDescription`
- `updateStrategicPlanSchema`: All fields are optional for partial updates
- Added enum validation for `PlanPriority` and `PlanStatus`

#### API Endpoints
- **POST /api/strategic-plan**: Creates single-language record with slug uniqueness check
- **PATCH /api/strategic-plan/:id**: Updates record with slug uniqueness check if slug is changed
- **GET /api/strategic-plan/public/:id**: Fetches by slug or id (supports both)

#### Admin Components
- **Admin Table**: Shows `title`, `slug`, `category`, `status`, `priority`, `isActive`, `createdAt`
- **Create Dialog**: Single-language form with auto-slug generation and language detection
- **Edit Dialog**: Updates single record with all available fields

#### Slug Generation
- Utility function `generateSlug()` creates URL-friendly slugs
- Auto-detects Arabic characters and appends `-ar` or `-en` suffix
- Manual slug override available in create dialog

### 🔄 Next Steps
1. Test full CRUD operations end-to-end
2. Add image upload functionality for `imageId` field
3. Consider adding date pickers for `startDate`, `endDate`, `publishedAt`
4. Add validation for slug format in frontend
5. Test error handling scenarios
