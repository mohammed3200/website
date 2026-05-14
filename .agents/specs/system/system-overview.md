# System Overview: EBIC Website
**Center for Entrepreneurship & Business Incubators - Misurata**

## Purpose
A bilingual (Arabic/English) platform serving the Misurata College of Industrial Technology. It manages public news, event information, and highly critical multi-step application routines for Innovators (project incubations) and Collaborators (sponsorships/partnerships). 

## Primary Domains
1. **Public Information**: Managed via Headless CMS functionality (News, FAQs, Strategic Plans).
2. **Registration Workflows**: Multi-step Zod-validated application pipelines storing state in local/session storage leading to final DB insertion and S3 asset uploads.
3. **Admin Dashboard**: Centralized management portal providing Role-Based Access Control (RBAC) to approve/reject submissions, manage users, edit content, and track metrics.

## Tech Stack Requirements
- **Framework**: Next.js 16.1.1 (App Router)
- **UI & Styling**: React 19, Tailwind CSS, shadcn/ui.
- **State & Forms**: Zustand, React Hook Form, Zod.
- **API**: Hono.js inside Next.js (`/api/[[...route]]/route.ts`).
- **Database**: MySQL 8.0 via Prisma ORM.
- **File Storage**: S3-compatible endpoints (AWS/R2/MinIO) replacing legacy DB BLOBs.
- **Background Tasks**: Redis + BullMQ (Emails, WhatsApp).
- **Internationalization**: `next-intl` (strict AR/EN JSON mapping).
- **Authentication**: NextAuth.js v5 (OAuth + Credentials).
