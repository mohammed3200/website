# Feature Specification: Admin Domain

## Overview
The Admin portal is the command center for EBIC. Located at `src/app/(standalone)/admin`. It features localized navigation (RTL/LTR), authentication enforcement, dashboard stats plotting, and specific RBAC-governed views.

## Access Flow
1. Global Middleware catches `/admin/*` requests. NextAuth checks session validity. Unauthenticated users are redirected to `/auth/login`.
2. Hono API routes enforcing `checkPermission` (`src/features/admin/server/route.ts`).
3. Only users with mapped roles (e.g., `SUPER_ADMIN`, `ADMIN`) can generate global invitations or execute deep mutation tasks inside `/api/admin/users/invite`.

## Component Conventions
- **Shared Topbar & Sidebar**: Renders dynamic items based on local user permissions. Uses `src/features/admin/hooks/use-admin-auth.ts`.
- **Dashboard Widgets**: Trends, Stats, Recent Activity Feed, Notification Bell (with BullMQ/Redis socket-like polling or frequent REST polling).

## i18n Boundaries
The Admin UI component layer MUST extract all string literals heavily—particularly navigation labels (`messages/Navigation.*`) and system errors—via `useTranslations()`. Never manually declare dictionaries.
