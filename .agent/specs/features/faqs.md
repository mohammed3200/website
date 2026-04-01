# Feature Specification: FAQs Domain

## Overview
The FAQs module handles frequently asked questions displayed on the EBIC public site, and provides an admin interface for CRUD operations.

## Architecture
- **Data Model**: Maps directly to `Faq` table in Prisma.
- **Frontend Display**: Read-only display rendered safely handling language switches (Arabic vs English).
- **Admin Management**: Dedicated table view supporting Hono RPC calls wrapped in TanStack Query for invalidation and optimistic updates.

## API Contract
- Handled at `src/features/faqs/server/route.ts` using identical RBAC standards (`checkPermission(RESOURCES.CONTENT)`).
- Requires proper 404 bubbling if a specific FAQ ID requested for edit/deletion does not exist.
