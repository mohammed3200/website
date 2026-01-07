# Project Tasks Roadmap

**Center for Leadership and Business Incubators - Misrata**

---

## Table of Contents

1. [Task 1: Finalize Email System Templates](#task-1-finalize-email-system-templates)
2. [Task 2: Redesign Innovators & Creators Feature](#task-2-redesign-innovators--creators-feature)
3. [Task 3: Send Notification Messages to System Administrators](#task-3-send-notification-messages-to-system-administrators)
4. [Task 4: Design and Develop Dashboard for Managers and Supervisors](#task-4-design-and-develop-dashboard-for-managers-and-supervisors)
5. [Task 5: Improve and Standardize Button Designs](#task-5-improve-and-standardize-button-designs)
6. [Task 6: Improve Card Layouts](#task-6-improve-card-layouts)
7. [Task 7: Integrate Email & WhatsApp for Registration Workflows](#task-7-integrate-email--whatsapp-for-registration-workflows)
8. [Task 8: Standardize File Naming Convention](#task-8-standardize-file-naming-convention)
9. [Task 9: Build WhatsApp Integration System](#task-9-build-whatsapp-integration-system)
10. [Task 10: Navigation Improvements](#task-10-navigation-improvements)
11. [Task 11: News Section UI Enhancements](#task-11-news-section-ui-enhancements)
12. [Task 12: Fix Registration Form Data Persistence](#task-12-fix-registration-form-data-persistence)
13. [Task 13: AI-Powered Form Redesign](#task-13-ai-powered-form-redesign)

---

## Overview

This document outlines the development tasks for enhancing the Center for Leadership and Business Incubators - Misrata platform. The tasks are organized by priority and include detailed subtasks, technical requirements, and acceptance criteria.

**Tech Stack Reference:**

- Frontend: Next.js 15.1.2, React 19, TypeScript, Tailwind CSS
- Backend: Hono.js, Prisma ORM
- Database: MySQL
- Email: Nodemailer, React Email
- Queue: BullMQ, Redis
- Authentication: NextAuth.js

---

## Task 1: Finalize Email System Templates

### Status: ✅ Completed

### Description

Complete and customize the existing email system templates to ensure they are production-ready with proper branding, bilingual support, and all necessary workflows.

### Current State

- ✅ Basic email infrastructure exists (`src/features/email/`)
- ✅ Email documentation available (`docs/email/`)
- ✅ Nodemailer and React Email configured
- ✅ Database models: `EmailLog`, `EmailQueue`, `EmailTemplate` (check schema)

### Subtasks

#### 1.1 Review and Test Existing Templates

- [ ] Review email templates in `src/lib/email/templates/` (if they exist)
- [ ] Test submission confirmation templates (English/Arabic)
- [ ] Test status update templates (approval/rejection)
- [ ] Test 2FA templates
- [ ] Verify RTL support for Arabic templates
- [ ] Test email rendering on multiple clients (Gmail, Outlook, mobile)

#### 1.2 Customize Templates for Branding

- [ ] Add EBIC logo and college branding to all templates
- [ ] Apply consistent color scheme (primary: orange, matching website)
- [ ] Add footer with contact information and social links
- [ ] Implement responsive design for mobile devices
- [ ] Add unsubscribe/preferences link (if applicable)

#### 1.3 Create Additional Templates

- [ ] Welcome email for new users
- [ ] Password reset email template
- [ ] Account verification email
- [ ] Weekly digest/newsletter template (optional)
- [ ] Admin notification templates

#### 1.4 Template Content Enhancement

- [ ] Improve copywriting for all templates (professional tone)
- [ ] Add clear call-to-action buttons
- [ ] Include estimated response times
- [ ] Add helpful links and resources
- [ ] Implement personalization tokens (name, company, etc.)

#### 1.5 Testing and Validation

- [ ] Run test-email-service.ts script
- [ ] Verify SMTP connection with Gmail
- [ ] Test email delivery to multiple providers
- [ ] Check spam score using mail-tester.com
- [ ] Verify database logging in `EmailLog` table

### Technical Requirements

- React Email components (`@react-email/components`)
- Handlebars for dynamic content
- Bilingual support (Arabic RTL, English LTR)
- Mobile-responsive design
- Accessibility (ARIA labels, alt text)

### Files to Modify/Create

- `src/lib/email/templates/` (all template files)
- `src/app/admin/settings/email-templates/` (Handlebars templates)
- `docs/email/templates.md` (documentation)

### Acceptance Criteria

- [ ] All templates render correctly in email preview
- [ ] Arabic templates display properly with RTL layout
- [ ] Emails pass spam filter tests
- [ ] Templates are consistent with website branding
- [ ] All dynamic content renders correctly
- [ ] Email logs are created in database

---

## Task 2: Redesign Innovators & Creators Feature

### Status: ✅ Completed

### Priority: 🔴 HIGH

### Description

Redesign and enhance the Innovators & Creators feature to include additional required fields and support for multiple project file uploads. This task involves database schema changes, form redesign, file upload functionality, and backend API updates.

### Current State

- ✅ Basic Innovator model exists with: name, email, phone, projectTitle, projectDescription, objective, stageDevelopment
- ✅ Registration form implemented (`innovators-registration-form.tsx`)
- ✅ Single image upload supported via `imageId`
- ❌ Missing: location, specialization fields
- ❌ Missing: Multiple project file upload support (PDF, Word, JPG, PNG, etc.)

### Required New Fields

1. **Location** - Innovator's geographical location (string)
2. **Specialization** - Area of expertise/industry sector (string)
3. **Project Files** - Multiple file uploads (documents, images, presentations)

### Subtasks

#### 2.1 Database Schema Updates

- [ ] Update `Innovator` model in `prisma/schema.prisma`:

  ```prisma
  model Innovator {
    id                 String                @id @default(cuid())
    name               String
    imageId            String?
    email              String
    phone              String
    location           String                // NEW: Geographical location
    specialization     String                // NEW: Area of expertise
    projectTitle       String
    projectDescription String?
    objective          String?
    stageDevelopment   StageDevelopment
    status             RecordStatus          @default(PENDING)
    isVisible          Boolean               @default(false)
    createdAt          DateTime              @default(now())
    updatedAt          DateTime              @updatedAt
    emailLogs          EmailLog[]            @relation("InnovatorEmails")
    projectFiles       InnovatorProjectFile[] // NEW: Multiple file uploads

    @@index([email])
    @@index([status])
    @@index([specialization])
  }
  ```

- [ ] Create new `InnovatorProjectFile` model:

  ```prisma
  model InnovatorProjectFile {
    id           String     @id @default(cuid())
    innovatorId  String
    innovator    Innovator  @relation(fields: [innovatorId], references: [id], onDelete: Cascade)
    fileName     String
    fileType     String     // MIME type (application/pdf, image/jpeg, etc.)
    fileSize     Int        // Size in bytes
    mediaId      String     // Reference to Media table for file storage
    description  String?    // Optional file description
    createdAt    DateTime   @default(now())
    updatedAt    DateTime   @updatedAt

    @@index([innovatorId])
    @@index([fileType])
  }
  ```

- [ ] Run Prisma migration:
  ```bash
  npx prisma migrate dev --name add_innovator_fields_and_files
  ```

#### 2.2 Update Validation Schemas

- [ ] Update `src/features/innovators/schemas.ts`:

  ```typescript
  export const createCreativeRegistrationSchema = (
    t: (key: string) => string,
  ) => {
    return z.object({
      // ====== Basic information ======
      name: z.string().min(1, { message: t('RequiredField') }),
      phoneNumber: z
        .string()
        .min(1, { message: t('RequiredField') })
        .refine(
          (phone) =>
            typeof phone === 'string' && /^\+[\d\s-]{6,15}$/.test(phone),
          { message: t('InvalidPhoneNumber') },
        ),
      email: z
        .string()
        .min(1, { message: t('RequiredField') })
        .email({ message: t('InvalidEmail') }),
      location: z.string().min(1, { message: t('RequiredField') }), // NEW
      specialization: z.string().min(1, { message: t('RequiredField') }), // NEW
      image: z
        .union([
          z.instanceof(File),
          z.string().transform((value) => (value === '' ? undefined : value)),
        ])
        .optional(),

      // ======= Project Details ======
      projectTitle: z.string().min(1, { message: t('RequiredField') }),
      projectDescription: z
        .string()
        .min(1, { message: t('RequiredField') })
        .max(1000, { message: `${t('MaximumFieldSize')} 1000` }),
      objective: z.string().optional(),
      stageDevelopment: z.nativeEnum(StageDevelopment).optional(),

      // ======= Project Files ======= NEW
      projectFiles: z
        .array(z.instanceof(File))
        .min(0)
        .max(10, { message: t('MaximumFiles') })
        .refine(
          (files) => {
            const maxSize = 10 * 1024 * 1024; // 10MB per file
            return files.every((file) => file.size <= maxSize);
          },
          { message: t('FileTooLarge') },
        )
        .refine(
          (files) => {
            const allowedTypes = [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'image/jpeg',
              'image/jpg',
              'image/png',
              'application/vnd.ms-powerpoint',
              'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            ];
            return files.every((file) => allowedTypes.includes(file.type));
          },
          { message: t('InvalidFileType') },
        )
        .optional(),

      // ======== Center Policies ========
      TermsOfUse: z
        .boolean()
        .default(false)
        .refine((value) => value === true, {
          message: t('TermsOfUse'),
        }),
    });
  };
  ```

#### 2.3 Update Registration Form Component

- [ ] Update `src/features/innovators/components/innovators-registration-form.tsx`:
  - [ ] Add Location input field
  - [ ] Add Specialization input field (consider dropdown/select with predefined options)
  - [ ] Add Project Files upload section with drag-and-drop
  - [ ] Display file list with remove option
  - [ ] Show file upload progress
  - [ ] Validate file types and sizes client-side
  - [ ] Update form layout to accommodate new fields

- [ ] Add multi-file upload UI:

  ```typescript
  const [projectFiles, setProjectFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProjectFiles((prev) => [...prev, ...files].slice(0, 10)); // Max 10 files
    form.setValue('projectFiles', [...projectFiles, ...files].slice(0, 10));
  };

  const removeFile = (index: number) => {
    const updated = projectFiles.filter((_, i) => i !== index);
    setProjectFiles(updated);
    form.setValue('projectFiles', updated);
  };
  ```

#### 2.4 Update API Endpoints

- [ ] Update `src/features/innovators/server/*.ts` or API route:
  - [ ] Handle new location and specialization fields
  - [ ] Process multiple file uploads
  - [ ] Store files in Media table
  - [ ] Create InnovatorProjectFile records
  - [ ] Validate file types server-side
  - [ ] Handle file size limits

- [ ] File upload handler example:

  ```typescript
  // Process project files
  if (projectFiles && projectFiles.length > 0) {
    for (const file of projectFiles) {
      // Convert file to buffer
      const buffer = await file.arrayBuffer();

      // Store in Media table
      const media = await db.media.create({
        data: {
          data: Buffer.from(buffer),
          type: file.type,
          size: file.size,
        },
      });

      // Create InnovatorProjectFile record
      await db.innovatorProjectFile.create({
        data: {
          innovatorId: innovator.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          mediaId: media.id,
        },
      });
    }
  }
  ```

#### 2.5 Update Card Component

- [ ] Update `src/features/innovators/components/card-innovators.tsx`:
  - [ ] Display location with icon
  - [ ] Display specialization badge
  - [ ] Add file count indicator
  - [ ] Update card layout for new fields

#### 2.6 Add Specialization Options

- [ ] Create specialization constants in `src/features/innovators/constants.ts`:
  ```typescript
  export const Specializations = {
    TECHNOLOGY: { ar: 'التكنولوجيا', en: 'Technology' },
    HEALTHCARE: { ar: 'الرعاية الصحية', en: 'Healthcare' },
    EDUCATION: { ar: 'التعليم', en: 'Education' },
    AGRICULTURE: { ar: 'الزراعة', en: 'Agriculture' },
    MANUFACTURING: { ar: 'التصنيع', en: 'Manufacturing' },
    SERVICES: { ar: 'الخدمات', en: 'Services' },
    ENERGY: { ar: 'الطاقة', en: 'Energy' },
    ENVIRONMENT: { ar: 'البيئة', en: 'Environment' },
    FINANCE: { ar: 'المالية', en: 'Finance' },
    OTHER: { ar: 'أخرى', en: 'Other' },
  };
  ```

#### 2.7 Add Translations

- [ ] Update locale files (`messages/ar.json`, `messages/en.json`):
  ```json
  {
    "CreatorsAndInnovators": {
      "form": {
        "location": "Location / الموقع",
        "specialization": "Specialization / التخصص",
        "projectFiles": "Project Files / ملفات المشروع",
        "uploadFiles": "Upload Files / تحميل الملفات",
        "maxFiles": "Maximum 10 files / حد أقصى 10 ملفات",
        "allowedTypes": "Allowed: PDF, Word, JPG, PNG, PPT / مسموح: PDF, Word, JPG, PNG, PPT",
        "fileTooLarge": "File size must not exceed 10MB / حجم الملف يجب ألا يتجاوز 10 ميجابايت",
        "invalidFileType": "Invalid file type / نوع ملف غير صالح",
        "maxFilesReached": "Maximum files reached / تم الوصول للحد الأقصى من الملفات"
      }
    }
  }
  ```

#### 2.8 Admin Dashboard Updates

- [ ] Update admin innovators list to show new fields
- [ ] Add file download functionality in admin view
- [ ] Add file preview modal (for images/PDFs)
- [ ] Update filter options to include location and specialization

#### 2.9 Testing

- [ ] Test form validation with new fields
- [ ] Test file upload (single and multiple files)
- [ ] Test file type validation
- [ ] Test file size validation
- [ ] Test with different file types (PDF, DOCX, images)
- [ ] Test file removal functionality
- [ ] Test database migrations
- [ ] Test API endpoints with new fields
- [ ] Test bilingual support for new fields
- [ ] Test admin dashboard file viewing

### Technical Requirements

- Next.js file upload handling (FormData)
- React Dropzone for drag-and-drop (already installed)
- File type validation (file-type package - already installed)
- Prisma migrations
- Media storage in database (LongBlob)

### Files to Modify/Create

- `prisma/schema.prisma` - Update Innovator model, create InnovatorProjectFile model
- `src/features/innovators/schemas.ts` - Add new field validations
- `src/features/innovators/components/innovators-registration-form.tsx` - Add fields and file upload UI
- `src/features/innovators/components/card-innovators.tsx` - Display new fields
- `src/features/innovators/constants.ts` - Add specialization options
- `src/features/innovators/server/*.ts` - Update API to handle files
- `messages/ar.json`, `messages/en.json` - Add translations
- `src/app/admin/innovators/*` - Update admin views

### File Upload UI Mockup

```
┌─────────────────────────────────────────┐
│ Project Files                           │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │ 📎 Drag & Drop files here         │   │
│ │     or click to browse            │   │
│ │                                   │   │
│ │  Allowed: PDF, Word, JPG, PNG, PPT│   │
│ │  Max: 10 files, 10MB each         │   │
│ └───────────────────────────────────┘   │
│                                         │
│ Uploaded Files:                         │
│ [ ] proposal.pdf (2.5 MB)      [X]      │
│ [ ] design.jpg (1.2 MB)        [X]      │
│ [ ] budget.xlsx (500 KB)       [X]      │
│                                         │
│ 3 of 10 files uploaded                  │
└─────────────────────────────────────────┘
```

### Acceptance Criteria

- [ ] Location field is required and validated
- [ ] Specialization field is required with predefined options
- [ ] Multiple files can be uploaded (up to 10 files)
- [ ] Only allowed file types are accepted (PDF, Word, JPG, PNG, PPT)
- [ ] File size validation (max 10MB per file)
- [ ] Files are stored securely in database
- [ ] Files can be downloaded from admin dashboard
- [ ] Form validation works for all new fields
- [ ] Bilingual support for all new fields
- [ ] Database migrations run successfully
- [ ] Existing innovator records remain intact
- [ ] Admin can view and manage files
- [ ] File upload progress is displayed
- [ ] Files can be removed before submission

### Time Estimate

**12-16 hours**

- Database schema (2 hours)
- Form updates (3-4 hours)
- File upload functionality (4-5 hours)
- API updates (2-3 hours)
- Admin dashboard updates (2 hours)
- Testing (2-3 hours)

---

## Task 3: Send Notification Messages to System Administrators

### Status: ✅ Completed

### Description

Implement a comprehensive notification system to alert system administrators when critical events occur, such as new registrations, submissions, or system errors. Notifications will be sent via email and eventually WhatsApp (once Task 8 is complete).

### Current State

- ✅ Email infrastructure exists (`src/lib/email/service.ts`)
- ✅ Admin user model with RBAC permissions
- ✅ EmailLog and EmailQueue models in database
- ❌ No automated admin notifications currently

### Subtasks

#### 2.1 Define Notification Events

- [ ] New collaborator registration
- [ ] New innovator registration
- [ ] Submission status changes
- [ ] System errors or failures
- [ ] User account activities (new admin users, role changes)
- [ ] Database backup completion
- [ ] Security alerts (failed login attempts, suspicious activity)

#### 2.2 Create Admin Notification Service

- [ ] Create `src/lib/notifications/admin-notifications.ts`
- [ ] Implement `notifyAdmins(event, data)` function
- [ ] Query database for admins with notification permissions
- [ ] Support filtering by permission type (e.g., only notify users with "collaborators:manage")
- [ ] Queue notifications for all eligible admins

#### 2.3 Email Templates for Admin Notifications

- [ ] New registration alert template (AR/EN)
- [ ] Submission review reminder template (AR/EN)
- [ ] System error alert template (AR/EN)
- [ ] Security alert template (AR/EN)
- [ ] Daily/Weekly digest template (AR/EN)
- [ ] Include direct links to admin dashboard actions

#### 2.4 Admin Notification Preferences

- [ ] Add notification preferences to User model
  ```prisma
  model User {
    // ... existing fields
    notificationPreferences Json? // { emailNewSubmissions: true, emailSystemErrors: true, etc. }
  }
  ```
- [ ] Create admin settings page for notification preferences
- [ ] Allow admins to enable/disable specific notification types
- [ ] Add option for digest mode (immediate vs. daily summary)

#### 2.5 Integration Points

- [ ] Trigger notification on new collaborator registration (`/api/collaborator` route)
- [ ] Trigger notification on new innovator registration (`/api/innovators` route)
- [ ] Trigger notification on system errors (error handlers)
- [ ] Add admin notification to approval/rejection workflows
- [ ] Create scheduled job for daily/weekly digests

#### 2.6 Admin Dashboard Notifications Panel

- [ ] Create notification bell icon in admin header
- [ ] Display unread notification count
- [ ] Create notification dropdown/panel
- [ ] Mark notifications as read
- [ ] Link notifications to relevant pages
- [ ] Store notifications in database for history

#### 2.7 Database Schema Updates

- [ ] Create `AdminNotification` model

  ```prisma
  model AdminNotification {
    id          String   @id @default(cuid())
    userId      String
    user        User     @relation(fields: [userId], references: [id])
    type        String   // "NEW_REGISTRATION", "SYSTEM_ERROR", etc.
    title       String
    message     String   @db.Text
    data        Json?    // Additional data for the notification
    isRead      Boolean  @default(false)
    readAt      DateTime?
    actionUrl   String?  // Direct link to take action
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt

    @@index([userId, isRead])
    @@index([createdAt])
  }
  ```

- [ ] Run Prisma migration

#### 2.8 Testing

- [ ] Test notification triggers for each event type
- [ ] Test admin preference filtering
- [ ] Test email delivery to multiple admins
- [ ] Test notification panel UI in dashboard
- [ ] Test mark as read functionality
- [ ] Test digest mode

### Technical Requirements

- Existing email service (`src/lib/email/service.ts`)
- BullMQ for scheduled jobs (already configured)
- Prisma ORM for database operations
- Next.js API routes for webhook endpoints
- React Query for real-time notification updates

### Files to Create/Modify

- `src/lib/notifications/admin-notifications.ts` (new)
- `src/lib/email/templates/admin/` (new directory)
- `src/app/admin/notifications/page.tsx` (new)
- `src/app/admin/settings/notifications/page.tsx` (new)
- `src/features/admin/components/NotificationBell.tsx` (new)
- `src/features/collaborators/server/route.ts` (modify)
- `src/features/innovators/server/route.ts` (modify)
- `prisma/schema.prisma` (add AdminNotification model)

### Acceptance Criteria

- [ ] Admins receive email notifications for new registrations
- [ ] Admins receive notifications for system errors
- [ ] Notification preferences can be customized per admin
- [ ] Notification panel shows recent alerts in dashboard
- [ ] Notifications include actionable links to relevant pages
- [ ] Both Arabic and English templates work correctly
- [ ] Notifications are logged in database
- [ ] Read/unread status is tracked properly

---

## Task 4: Design and Develop Dashboard for Managers and Supervisors

### Status: 🟡 In Progress (UI Complete, Real Data Pending)

### Description

Create a dedicated dashboard interface for managers and supervisors (non-technical admin users) that provides an intuitive overview of key metrics, pending actions, and simplified controls for common tasks.

### Current State

- ✅ RBAC system exists with Role and Permission models
- ✅ Basic admin dashboard exists (`/admin/dashboard`)
- ❌ Current dashboard is developer-focused, not manager-friendly
- ❌ No role-specific dashboard views

### Subtasks

#### 3.1 Requirements & Design

- [ ] Conduct user research with managers/supervisors
- [ ] Define key metrics managers need to see
- [ ] Create wireframes for manager dashboard
- [ ] Design mobile-responsive layouts
- [ ] Get stakeholder approval on designs

#### 3.2 Dashboard Layout Structure

- [ ] Create manager-specific dashboard route (`/admin/manager-dashboard`)
- [ ] Design header with quick actions
- [ ] Create sidebar with simplified navigation
- [ ] Implement responsive grid layout for widgets
- [ ] Add customizable widget arrangement

#### 3.3 Key Metrics Widgets

- [ ] **Pending Reviews Widget**
  - Count of pending collaborator submissions
  - Count of pending innovator submissions
  - Quick links to review pages
- [ ] **Recent Activity Widget**
  - Timeline of recent registrations
  - Recent approvals/rejections
  - System activity log
- [ ] **Statistics Widget**
  - Total collaborators (approved/pending/rejected)
  - Total innovators (approved/pending/rejected)
  - Charts showing trends over time
- [ ] **Quick Actions Widget**
  - Review pending submissions
  - Manage users
  - View reports
  - System settings

#### 3.4 Data Visualization

- [ ] Install charting library (Chart.js or Recharts)
- [ ] Create line chart for registration trends
- [ ] Create pie chart for submission statuses
- [ ] Create bar chart for monthly/weekly comparisons
- [ ] Add date range filters for charts
- [ ] Export charts as images/PDFs

#### 3.5 Simplified Review Interface

- [ ] Create card-based review interface
- [ ] One-click approve/reject buttons
- [ ] Inline view of submission details
- [ ] Bulk actions (approve/reject multiple)
- [ ] Add comment/reason field for rejections
- [ ] Show submission history

#### 3.6 Reporting Features

- [ ] Generate monthly summary reports
- [ ] Export data to Excel/CSV
- [ ] Create printable report templates
- [ ] Schedule automated report emails
- [ ] Custom date range reports

#### 3.7 Role-Based Dashboard Routing

- [ ] Detect user role on login
- [ ] Redirect managers to manager dashboard
- [ ] Redirect developers/admins to technical dashboard
- [ ] Add dashboard preference in user settings
- [ ] Allow users to switch between dashboard views

#### 3.8 Mobile Optimization

- [ ] Optimize dashboard for tablet devices
- [ ] Create mobile-specific widget layouts
- [ ] Implement touch-friendly controls
- [ ] Test on various mobile devices
- [ ] Add pull-to-refresh functionality

#### 3.9 Notifications Integration

- [ ] Display notification count on dashboard
- [ ] Show recent notifications widget
- [ ] Highlight urgent/high-priority items
- [ ] Add notification sound toggle
- [ ] Implement desktop push notifications (optional)

#### 3.10 Performance Optimization

- [ ] Implement data caching for metrics
- [ ] Add skeleton loaders for widgets
- [ ] Lazy load heavy components
- [ ] Optimize database queries
- [ ] Add pagination for large datasets

### Dashboard Permissions

Create new permission resources:

- `dashboard:manager:view` - View manager dashboard
- `dashboard:manager:customize` - Customize widget layout
- `submissions:review` - Review and approve/reject submissions
- `reports:generate` - Generate and export reports

### Technical Requirements

- Next.js App Router for dashboard pages
- TanStack Query for data fetching
- Recharts or Chart.js for visualizations
- Tailwind CSS for styling
- Framer Motion for animations (already installed)
- React Hook Form for forms (already installed)

### Files to Create

- `src/app/admin/manager-dashboard/page.tsx` (main dashboard)
- `src/features/admin/components/ManagerDashboard/` (component directory)
  - `MetricsWidget.tsx`
  - `PendingReviewsWidget.tsx`
  - `RecentActivityWidget.tsx`
  - `StatisticsWidget.tsx`
  - `QuickActionsWidget.tsx`
  - `ChartWidget.tsx`
- `src/features/admin/api/use-dashboard-metrics.ts` (data fetching)
- `src/app/api/admin/metrics/route.ts` (API endpoint)
- `src/features/admin/components/ReviewInterface/` (review components)
- `src/features/admin/components/Reports/` (reporting components)

### Acceptance Criteria

- [ ] Manager dashboard is accessible at `/admin/manager-dashboard`
- [ ] Dashboard displays real-time metrics accurately
- [ ] Charts and visualizations render correctly
- [ ] Review interface allows quick approve/reject actions
- [ ] Dashboard is responsive on mobile and tablet
- [ ] Managers can customize widget layout
- [ ] Role-based routing works correctly
- [ ] Dashboard loads in under 2 seconds
- [ ] Reports can be generated and exported
- [ ] All text supports Arabic and English

---

## Task 5: Improve and Standardize Button Designs

### Status: ✅ Completed

### Description

Build a notification system similar to the email system but using WhatsApp for instant messaging. This will provide an alternative communication channel for users who prefer WhatsApp.

### Architecture Overview

```
┌─────────────────┐
│ User Action     │
│ (Registration)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ RPC Handler                     │
│ - Creates EmailQueue record     │
│ - Creates WhatsAppQueue record  │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────────┐
│ Email  │ │ WhatsApp     │
│ Worker │ │ Worker       │
└────────┘ └──────────────┘
```

### Subtasks

#### 2.1 Research and Setup

- [ ] Choose WhatsApp Business API provider (Twilio, Meta Cloud API, or others)
- [ ] Create WhatsApp Business account
- [ ] Obtain API credentials and phone number
- [ ] Test API connection and message sending
- [ ] Review rate limits and pricing

#### 2.2 Database Schema

- [ ] Create `WhatsAppQueue` model in Prisma schema
  ```prisma
  model WhatsAppQueue {
    id          String      @id @default(cuid())
    to          String      // Phone number in E.164 format
    message     String      @db.Text
    templateId  String?
    status      QueueStatus @default(PENDING)
    messageId   String?
    errorMessage String?
    sentAt      DateTime?
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
  }
  ```
- [ ] Create `WhatsAppLog` model for tracking
- [ ] Create `WhatsAppTemplate` model for message templates
- [ ] Run Prisma migration

#### 2.3 WhatsApp Service Layer

- [ ] Create `src/lib/whatsapp/service.ts` (main service)
- [ ] Create `src/lib/whatsapp/client.ts` (API client wrapper)
- [ ] Implement `sendMessage(to, message)` function
- [ ] Implement `sendTemplate(to, templateId, params)` function
- [ ] Add phone number validation (libphonenumber-js)
- [ ] Add error handling and retry logic

#### 2.4 Message Templates

- [ ] Create submission confirmation template (Arabic/English)
- [ ] Create approval notification template
- [ ] Create rejection notification template
- [ ] Create reminder template
- [ ] Test templates with WhatsApp Business API

#### 2.5 Queue Worker

- [ ] Create `services/whatsapp-worker/worker.ts`
- [ ] Implement BullMQ queue processing
- [ ] Add row locking to prevent duplicate sends
- [ ] Implement retry logic (3 attempts)
- [ ] Log all sends to `WhatsAppLog` table
- [ ] Add worker script to package.json: `worker:whatsapp`

#### 2.6 RPC Integration

- [ ] Create `src/lib/whatsapp/rpc/sendMessage.ts`
- [ ] Register WhatsApp methods in RPC registry
- [ ] Add validation with Zod schemas
- [ ] Test RPC endpoint: `/api/rpc`

#### 2.7 Testing

- [ ] Unit tests for WhatsApp service
- [ ] Integration tests for queue worker
- [ ] E2E test for registration workflow
- [ ] Test with real phone numbers
- [ ] Test rate limiting

### Technical Requirements

- WhatsApp Business API (Twilio or Meta)
- Phone number validation (libphonenumber-js - already installed)
- BullMQ queue (already configured)
- Prisma ORM for database

### Environment Variables

```env
WHATSAPP_API_KEY="your-api-key"
WHATSAPP_PHONE_NUMBER="+1234567890"
WHATSAPP_API_PROVIDER="twilio" # or "meta"
WHATSAPP_WEBHOOK_URL="https://yourdomain.com/api/whatsapp/webhook"
```

### Files to Create

- `src/lib/whatsapp/service.ts`
- `src/lib/whatsapp/client.ts`
- `src/lib/whatsapp/templates/`
- `src/lib/whatsapp/rpc/sendMessage.ts`
- `services/whatsapp-worker/worker.ts`
- `services/whatsapp-worker/config.ts`
- `tests/whatsapp/` (all test files)
- `docs/whatsapp/README.md`

### Acceptance Criteria

- [ ] WhatsApp messages send successfully via API
- [ ] Messages are queued and processed by worker
- [ ] Templates support both Arabic and English
- [ ] Phone numbers are validated before sending
- [ ] All sends are logged to database
- [ ] Error handling works correctly
- [ ] RPC endpoint accepts WhatsApp requests

---

### Status: 🔴 Not Started

### Description

Standardize button designs across the entire platform while giving send buttons a distinctive look. Create a consistent design system for all interactive elements.

### Current State

- ✅ Existing button components:
  - `src/components/buttons/SubmitButton.tsx`
  - `src/components/buttons/ActiveButton.tsx`
  - `src/components/buttons/TranslateButton.tsx`
  - `src/components/ui/button.tsx`

### Subtasks

#### 3.1 Audit Current Buttons

- [ ] List all button usage across the platform
- [ ] Document current button styles and variants
- [ ] Identify inconsistencies in design
- [ ] Screenshot all button types for reference

#### 3.2 Design System Planning

- [ ] Define button hierarchy (primary, secondary, tertiary)
- [ ] Define button states (default, hover, active, disabled, loading)
- [ ] Define button sizes (sm, md, lg, xl)
- [ ] Define special buttons (send, delete, cancel)
- [ ] Create color palette for buttons
- [ ] Design focus states for accessibility

#### 3.3 Create Base Button Component

- [ ] Refactor `src/components/ui/button.tsx` with variants
- [ ] Implement CVA (class-variance-authority) for variants
- [ ] Add proper TypeScript types
- [ ] Support all HTML button attributes
- [ ] Add loading state with spinner
- [ ] Add icon support (left/right)

#### 3.4 Create Specialized Buttons

- [ ] **SubmitButton** (send buttons with distinctive design)
  - Enhance animation for loading state
  - Add distinctive gradient or glow effect
  - Implement success animation
- [ ] **PrimaryButton** (main actions)
- [ ] **SecondaryButton** (secondary actions)
- [ ] **OutlineButton** (tertiary actions)
- [ ] **DangerButton** (delete, reject actions)
- [ ] **IconButton** (icon-only buttons)
- [ ] **LinkButton** (button styled as link)

#### 3.5 Send Button Distinctive Design

- [ ] Create unique visual style for send buttons
- [ ] Add animation on click (paper plane flying, etc.)
- [ ] Add success feedback animation
- [ ] Implement distinctive hover effects
- [ ] Add sound effect (optional)
- [ ] Test on all forms (contact, registration, etc.)

#### 3.6 Implement Across Platform

- [ ] Replace buttons in forms
- [ ] Replace buttons in modals/dialogs
- [ ] Replace buttons in admin dashboard
- [ ] Replace buttons in navigation
- [ ] Update all feature components

#### 3.7 Documentation

- [ ] Create Storybook stories for all button variants
- [ ] Document usage in component library
- [ ] Add examples and best practices
- [ ] Create visual design guide

### Technical Requirements

- class-variance-authority (CVA) - already installed
- Tailwind CSS for styling
- Framer Motion for animations - already installed
- Lucide React for icons - already installed

### Button Variants Structure

```typescript
const buttonVariants = cva('base-button-classes', {
  variants: {
    variant: {
      primary: '...',
      secondary: '...',
      outline: '...',
      danger: '...',
      ghost: '...',
      link: '...',
      send: '...', // Distinctive style
    },
    size: {
      sm: '...',
      md: '...',
      lg: '...',
      xl: '...',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### Files to Modify/Create

- `src/components/ui/button.tsx` (main button component)
- `src/components/buttons/SubmitButton.tsx` (refactor)
- `src/components/buttons/index.ts` (barrel export)
- `docs/components/buttons.md` (documentation)
- All feature components using buttons

### Acceptance Criteria

- [ ] All buttons use consistent design system
- [ ] Send buttons have distinctive, attractive design
- [ ] Buttons are accessible (keyboard, screen readers)
- [ ] Loading states work correctly
- [ ] Hover and focus states are clear
- [ ] Buttons are responsive on mobile
- [ ] Documentation is complete

---

## Task 6: Improve Card Layouts

### Status: ✅ Completed

### Description

Redesign card components to accurately reflect database data and provide better visual presentation of collaborators and innovators.

### Current State

- `src/features/collaborators/components/CardCompanies.tsx` - needs redesign
- `src/features/innovators/components/card-innovators.tsx` - empty, needs complete implementation

### Subtasks

#### 4.1 Analyze Database Schema

- [ ] Review `Collaborator` model in Prisma schema
  - Fields: companyName, email, phone, location, site, sector, specialization, experience, machinery, image
  - Related: ExperienceProvidedMedia, MachineryAndEquipmentMedia
- [ ] Review `Innovator` model in Prisma schema
  - Fields: name, email, phone, projectTitle, description, objective, stageDevelopment, image
- [ ] Identify required vs optional fields
- [ ] Determine display priority of fields

#### 4.2 Design CardCompanies Component

- [ ] Audit current implementation
- [ ] Fix FIXME comments in existing code
- [ ] Design new layout for company information
- [ ] Add support for all database fields:
  - [ ] Company logo/image display
  - [ ] Company name (prominent)
  - [ ] Industrial sector badge
  - [ ] Specialization tags
  - [ ] Experience provided summary
  - [ ] Machinery and equipment summary
  - [ ] Contact information (phone, email, website)
  - [ ] Location (with icon)
  - [ ] Media gallery preview
- [ ] Implement hover effects
- [ ] Add responsive design (mobile, tablet, desktop)

#### 4.3 Design card-innovators Component (From Scratch)

- [ ] Create complete component structure
- [ ] Design card layout for innovator information:
  - [ ] Innovator photo/avatar
  - [ ] Name (prominent)
  - [ ] Project title
  - [ ] Project description (truncated with "read more")
  - [ ] Project objective
  - [ ] Development stage badge
  - [ ] Contact information
  - [ ] Project status indicator
- [ ] Add card actions (view details, contact)
- [ ] Implement hover and focus states
- [ ] Add loading skeleton state
- [ ] Implement responsive design

#### 4.4 Shared Card Features

- [ ] Create base card component (`src/components/ui/card.tsx`)
- [ ] Implement card variants (collaborator, innovator, news, etc.)
- [ ] Add image optimization with Next.js Image
- [ ] Add lazy loading for images
- [ ] Add badge component for statuses
- [ ] Add tag component for specializations/sectors
- [ ] Create media gallery modal for multiple images

#### 4.5 Implement Gallery Support

- [ ] Display multiple media items for collaborators
- [ ] Implement photoswipe gallery (already installed)
- [ ] Create thumbnail grid
- [ ] Add lightbox for full-screen view
- [ ] Support video media (if applicable)

#### 4.6 Accessibility & UX

- [ ] Add proper ARIA labels
- [ ] Implement keyboard navigation
- [ ] Add focus indicators
- [ ] Test with screen readers
- [ ] Add loading states
- [ ] Add error states (broken images, missing data)
- [ ] Implement placeholder for missing images

#### 4.7 Integration with Data Fetching

- [ ] Update API routes to return complete data
- [ ] Add data validation with Zod
- [ ] Implement proper error handling
- [ ] Add pagination support for card lists
- [ ] Add filtering and sorting options

### Database Fields Mapping

#### Collaborator Card Fields

```typescript
interface CollaboratorCardProps {
  id: string;
  companyName: string;
  primaryPhoneNumber: string;
  optionalPhoneNumber?: string;
  email: string;
  location?: string;
  site?: string;
  industrialSector: string;
  specialization: string;
  experienceProvided?: string;
  machineryAndEquipment?: string;
  imageId?: string;
  experienceProvidedMedia: Media[];
  machineryAndEquipmentMedia: Media[];
  status: RecordStatus;
  isVisible: boolean;
}
```

#### Innovator Card Fields

```typescript
interface InnovatorCardProps {
  id: string;
  name: string;
  imageId?: string;
  email: string;
  phone: string;
  projectTitle: string;
  projectDescription?: string;
  objective?: string;
  stageDevelopment: StageDevelopment;
  status: RecordStatus;
  isVisible: boolean;
}
```

### Design Specifications

- Card width: Flexible with max-width constraints
- Card height: Auto, maintaining aspect ratio
- Border radius: 16px (rounded-2xl)
- Shadow: Elevated shadow on hover
- Spacing: Consistent padding (16px/24px)
- Typography: Clear hierarchy with din-bold/din-regular fonts

### Files to Modify/Create

- `src/features/collaborators/components/CardCompanies.tsx` (refactor)
- `src/features/innovators/components/card-innovators.tsx` (implement)
- `src/components/ui/card.tsx` (base component)
- `src/components/ui/badge.tsx` (status badges)
- `src/components/ui/tag.tsx` (category tags)
- `src/components/ui/gallery-modal.tsx` (media gallery)
- `src/features/collaborators/api/` (data fetching)
- `src/features/innovators/api/` (data fetching)

### Acceptance Criteria

- [ ] CardCompanies accurately displays all database fields
- [ ] card-innovators is fully implemented and functional
- [ ] Cards are responsive on all screen sizes
- [ ] Images load with proper optimization
- [ ] Media galleries work correctly
- [ ] Cards are accessible (WCAG 2.1 AA)
- [ ] Loading and error states are implemented
- [ ] Cards work with RTL (Arabic) layout
- [ ] Hover effects are smooth and performant

---

## Task 7: Integrate Email & WhatsApp for Registration Workflows

### Status: 🔴 Not Started

### Description

Integrate both email and WhatsApp notification systems into the registration, acceptance, and rejection workflows for collaborators and innovators.

### Workflow Overview

```
User Submits Registration
         │
         ▼
    Save to Database
    (status: PENDING)
         │
         ▼
    Send Confirmation
    ┌────┴────┐
    ▼         ▼
  Email    WhatsApp
  Queued    Queued
    │         │
    ▼         ▼
  Sent      Sent
         │
         ▼
    Admin Reviews
         │
    ┌────┴────┐
    ▼         ▼
Approve    Reject
    │         │
    ▼         ▼
Send Status Update
    ┌────┴────┐
    ▼         ▼
  Email    WhatsApp
```

### Subtasks

#### 5.1 Registration Workflow Integration

##### 5.1.1 Collaborator Registration

- [ ] Update registration API endpoint
- [ ] Add dual notification trigger on submission
- [ ] Create confirmation email template
- [ ] Create confirmation WhatsApp template
- [ ] Queue both notifications
- [ ] Store notification IDs in database
- [ ] Add UI feedback for successful submission

##### 5.1.2 Innovator Registration

- [ ] Update registration API endpoint
- [ ] Add dual notification trigger on submission
- [ ] Create confirmation email template
- [ ] Create confirmation WhatsApp template
- [ ] Queue both notifications
- [ ] Store notification IDs in database
- [ ] Add UI feedback for successful submission

#### 5.2 Admin Approval/Rejection Workflow

##### 5.2.1 Admin Dashboard Integration

- [ ] Add approval action to admin dashboard
- [ ] Add rejection action with reason field
- [ ] Update status in database
- [ ] Trigger status update notifications
- [ ] Display notification status in admin UI

##### 5.2.2 Approval Notifications

- [ ] Create approval email template (bilingual)
- [ ] Create approval WhatsApp template (bilingual)
- [ ] Include next steps in notification
- [ ] Add welcome information
- [ ] Include contact details for questions

##### 5.2.3 Rejection Notifications

- [ ] Create rejection email template (bilingual)
- [ ] Create rejection WhatsApp template (bilingual)
- [ ] Include rejection reason (if provided)
- [ ] Offer improvement suggestions
- [ ] Include reapplication information

#### 5.3 Notification Preferences

- [ ] Add user preference model to database
  ```prisma
  model NotificationPreference {
    id              String  @id @default(cuid())
    email           String  @unique
    emailEnabled    Boolean @default(true)
    whatsappEnabled Boolean @default(true)
    phoneNumber     String?
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt
  }
  ```
- [ ] Add preference selection in registration form
- [ ] Respect user preferences when sending notifications
- [ ] Add preference management UI

#### 5.4 Notification Tracking

- [ ] Link notifications to user records
- [ ] Track delivery status (sent, delivered, failed)
- [ ] Track read receipts (if available)
- [ ] Create notification history view in admin
- [ ] Add retry mechanism for failed notifications

#### 5.5 Edge Cases & Error Handling

- [ ] Handle invalid email addresses
- [ ] Handle invalid phone numbers
- [ ] Handle notification service outages
- [ ] Implement fallback notifications
- [ ] Add notification logs for debugging
- [ ] Handle rate limiting from providers

#### 5.6 Testing

- [ ] Test complete registration flow (both types)
- [ ] Test approval workflow with notifications
- [ ] Test rejection workflow with notifications
- [ ] Test with email only preference
- [ ] Test with WhatsApp only preference
- [ ] Test with both preferences
- [ ] Test error scenarios
- [ ] Load test with multiple simultaneous registrations

### Integration Points

#### API Endpoints to Modify

```typescript
// Collaborator registration
POST /api/collaborator/register
  -> Save to DB
  -> Queue email confirmation
  -> Queue WhatsApp confirmation

// Innovator registration
POST /api/innovators/register
  -> Save to DB
  -> Queue email confirmation
  -> Queue WhatsApp confirmation

// Admin actions
POST /api/admin/collaborator/approve/:id
  -> Update status to APPROVED
  -> Queue email notification
  -> Queue WhatsApp notification

POST /api/admin/collaborator/reject/:id
  -> Update status to REJECTED
  -> Queue email notification
  -> Queue WhatsApp notification

POST /api/admin/innovator/approve/:id
  -> Update status to APPROVED
  -> Queue email notification
  -> Queue WhatsApp notification

POST /api/admin/innovator/reject/:id
  -> Update status to REJECTED
  -> Queue email notification
  -> Queue WhatsApp notification
```

### Notification Templates Required

#### Email Templates

1. Collaborator confirmation (AR/EN)
2. Innovator confirmation (AR/EN)
3. Collaborator approval (AR/EN)
4. Innovator approval (AR/EN)
5. Collaborator rejection (AR/EN)
6. Innovator rejection (AR/EN)

#### WhatsApp Templates

1. Collaborator confirmation (AR/EN)
2. Innovator confirmation (AR/EN)
3. Collaborator approval (AR/EN)
4. Innovator approval (AR/EN)
5. Collaborator rejection (AR/EN)
6. Innovator rejection (AR/EN)

### Files to Modify/Create

- `src/features/collaborators/api/register.ts`
- `src/features/innovators/api/register.ts`
- `src/features/admin/api/approve.ts`
- `src/features/admin/api/reject.ts`
- `src/lib/notifications/service.ts` (unified notification service)
- `prisma/schema.prisma` (NotificationPreference model)
- All template files (email and WhatsApp)

### Acceptance Criteria

- [ ] Registration triggers both email and WhatsApp confirmations
- [ ] Approval sends notifications via both channels
- [ ] Rejection sends notifications via both channels
- [ ] User preferences are respected
- [ ] Notifications are logged and trackable
- [ ] Admin can view notification history
- [ ] Failed notifications are retried
- [ ] Both Arabic and English templates work correctly
- [ ] All edge cases are handled gracefully

---

## Task 8: Standardize File Naming Convention

### Status: 🔴 Not Started

### Description

Adopt a consistent file naming convention across the entire project, using either the kebab-case (CardCompanies) or lowercase-with-hyphens (card-innovators) style.

### Naming Convention Decision

After analyzing the existing codebase, the recommended convention is:

- **Components**: PascalCase for React components (e.g., `CardCompanies.tsx`, `SubmitButton.tsx`)
- **Utilities/Services**: kebab-case (e.g., `email-service.ts`, `auth-utils.ts`)
- **API Routes**: kebab-case (e.g., `send-email.ts`, `approve-collaborator.ts`)
- **Types**: PascalCase with `.types.ts` suffix (e.g., `Collaborator.types.ts`)

This aligns with Next.js conventions and React best practices.

### Subtasks

#### 6.1 Audit Current File Naming

- [ ] List all files in the project
- [ ] Categorize files by type (components, utils, API, etc.)
- [ ] Identify naming inconsistencies
- [ ] Create naming convention document

#### 6.2 Create Naming Convention Guide

- [ ] Document naming rules for each file type:
  - React components
  - Utility functions
  - API routes
  - Type definitions
  - Test files
  - Configuration files
  - Style files
- [ ] Provide examples for each category
- [ ] Document exceptions (if any)
- [ ] Add to project documentation

#### 6.3 Plan Refactoring Strategy

- [ ] Identify high-risk renames (frequently imported)
- [ ] Create rename script or checklist
- [ ] Determine order of renaming (dependencies first)
- [ ] Plan testing after each rename batch
- [ ] **POSTPONE** actual renaming for later phase

#### 6.4 Update Import Statements

- [ ] Use VSCode refactor tool for safe renames
- [ ] Update all import statements
- [ ] Update dynamic imports
- [ ] Update webpack/Next.js configs (if needed)
- [ ] Update test file imports

#### 6.5 Update Documentation

- [ ] Update README with naming convention
- [ ] Update CONTRIBUTING guide
- [ ] Update code review checklist
- [ ] Update onboarding documentation
- [ ] Add ESLint rules for naming (optional)

#### 6.6 Create Tracking List for Future Renames

- [ ] List files that need renaming
- [ ] Prioritize by impact (low risk first)
- [ ] Document dependencies for each file
- [ ] Create GitHub issues for each rename batch
- [ ] Schedule rename sprints

### Naming Convention Guidelines

#### React Components

```
✅ CardCompanies.tsx
✅ SubmitButton.tsx
✅ EmailTemplate.tsx
❌ card-companies.tsx
❌ submit-button.tsx
```

#### Utilities & Services

```
✅ email-service.ts
✅ auth-utils.ts
✅ format-date.ts
❌ emailService.ts
❌ authUtils.ts
```

#### API Routes (Hono/Next.js)

```
✅ send-email.ts
✅ approve-collaborator.ts
❌ sendEmail.ts
❌ approveCollaborator.ts
```

#### Type Definitions

```
✅ Collaborator.types.ts
✅ Email.types.ts
✅ User.types.ts
❌ collaborator.ts (ambiguous)
```

#### Test Files

```
✅ email-service.test.ts
✅ CardCompanies.test.tsx
✅ auth-utils.spec.ts
```

### Files Requiring Attention

#### Inconsistent Naming Examples

- `src/features/innovators/components/card-innovators.tsx` (should be `CardInnovators.tsx`)
- Other files TBD during audit

### ESLint Rules (Optional)

```javascript
// .eslintrc.js
rules: {
  'filenames/match-regex': [
    'error',
    {
      '.tsx$': '^[A-Z][a-zA-Z0-9]*$', // PascalCase for components
      '.ts$': '^[a-z][a-z0-9-]*$',   // kebab-case for utilities
    }
  ]
}
```

### Acceptance Criteria

- [ ] Naming convention document is created
- [ ] All team members agree on convention
- [ ] Tracking list of files to rename is created
- [ ] Rename priority is determined
- [ ] Documentation is updated
- [ ] ESLint rules are configured (optional)
- [ ] **Actual renaming is postponed** for future sprint

---

## Dependencies & Prerequisites

### Required Tools

- Node.js (v18+)
- MySQL database
- Redis server
- pnpm (v10.4.1)

### Required API Keys

- Gmail App Password (for email)
- WhatsApp Business API key (to be obtained)
- Redis connection (local or cloud)

### Installed Dependencies

All dependencies are already installed according to `package.json`:

- nodemailer
- react-email
- @react-email/components
- bullmq
- ioredis
- libphonenumber-js
- framer-motion
- class-variance-authority
- photoswipe

---

## Testing Strategy

### Unit Tests

- Email service functions
- WhatsApp service functions
- Button component variants
- Card component rendering
- Utility functions

### Integration Tests

- Complete registration workflow
- Notification delivery (email + WhatsApp)
- Admin approval/rejection workflow
- Database operations

### E2E Tests

- User registration flow
- Admin dashboard actions
- Notification reception
- Multi-language support

### Testing Tools

- Jest (already configured)
- React Testing Library (already installed)
- Playwright (optional for E2E)

---

## Timeline Estimates

| Task                         | Estimated Time            | Priority |
| ---------------------------- | ------------------------- | -------- |
| Task 1: Email Templates      | 8-12 hours                | High     |
| Task 2: Admin Notifications  | 12-16 hours               | High     |
| Task 3: Manager Dashboard    | 24-32 hours               | High     |
| Task 4: Button Design        | 8-12 hours                | Medium   |
| Task 5: Card Layouts         | 12-16 hours               | High     |
| Task 6: Workflow Integration | 16-20 hours               | High     |
| Task 7: Naming Convention    | 4-6 hours (documentation) | Low      |
| Task 8: WhatsApp System      | 16-24 hours               | Medium   |

**Total Estimated Time**: 100-138 hours

---

## Success Metrics

### Functional Metrics

- [ ] All notifications (email + WhatsApp) delivered successfully
- [ ] Registration completion rate improved
- [ ] Admin workflow efficiency increased
- [ ] User satisfaction with notifications

### Technical Metrics

- [ ] Code coverage ≥ 80%
- [ ] All tests passing
- [ ] No console errors in production
- [ ] Lighthouse score ≥ 90

### UX Metrics

- [ ] Button click-through rate improved
- [ ] Card interaction increased
- [ ] Mobile responsiveness improved
- [ ] Accessibility score improved

---

## Risk Assessment

### High Risk

- WhatsApp API integration (depends on external provider)
- Database migrations (potential data loss)
- Breaking changes in file renaming

### Medium Risk

- Email deliverability (spam filters)
- Performance impact of notifications
- Template rendering issues

### Low Risk

- Button styling changes
- Card layout improvements
- Documentation updates

---

## Notes

- All tasks should maintain backward compatibility where possible
- Test thoroughly before deploying to production
- Document all API changes
- Keep bilingual support (Arabic/English) in mind for all user-facing features
- Follow existing code patterns and conventions
- Prioritize accessibility and mobile responsiveness

---

## Task 9: Build WhatsApp Integration System

### Status: 🔴 Not Started

### Description

Build a notification system similar to the email system but using WhatsApp for instant messaging. This will provide an alternative communication channel for users who prefer WhatsApp.

### Architecture Overview

```
┌─────────────────┐
│ User Action     │
│ (Registration)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│ RPC Handler                     │
│ - Creates EmailQueue record     │
│ - Creates WhatsAppQueue record  │
└────────┬────────────────────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────────┐
│ Email  │ │ WhatsApp     │
│ Worker │ │ Worker       │
└────────┘ └──────────────┘
```

### Subtasks

#### 8.1 Research and Setup

- [ ] Choose WhatsApp Business API provider (Twilio, Meta Cloud API, or others)
- [ ] Create WhatsApp Business account
- [ ] Obtain API credentials and phone number
- [ ] Test API connection and message sending
- [ ] Review rate limits and pricing

#### 8.2 Database Schema

- [ ] Create `WhatsAppQueue` model in Prisma schema
  ```prisma
  model WhatsAppQueue {
    id          String      @id @default(cuid())
    to          String      // Phone number in E.164 format
    message     String      @db.Text
    templateId  String?
    status      QueueStatus @default(PENDING)
    messageId   String?
    errorMessage String?
    sentAt      DateTime?
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
  }
  ```
- [ ] Create `WhatsAppLog` model for tracking
- [ ] Create `WhatsAppTemplate` model for message templates
- [ ] Run Prisma migration

#### 8.3 WhatsApp Service Layer

- [ ] Create `src/lib/whatsapp/service.ts` (main service)
- [ ] Create `src/lib/whatsapp/client.ts` (API client wrapper)
- [ ] Implement `sendMessage(to, message)` function
- [ ] Implement `sendTemplate(to, templateId, params)` function
- [ ] Add phone number validation (libphonenumber-js)
- [ ] Add error handling and retry logic

#### 8.4 Message Templates

- [ ] Create submission confirmation template (Arabic/English)
- [ ] Create approval notification template
- [ ] Create rejection notification template
- [ ] Create reminder template
- [ ] Test templates with WhatsApp Business API

#### 8.5 Queue Worker

- [ ] Create `services/whatsapp-worker/worker.ts`
- [ ] Implement BullMQ queue processing
- [ ] Add row locking to prevent duplicate sends
- [ ] Implement retry logic (3 attempts)
- [ ] Log all sends to `WhatsAppLog` table
- [ ] Add worker script to package.json: `worker:whatsapp`

#### 8.6 RPC Integration

- [ ] Create `src/lib/whatsapp/rpc/sendMessage.ts`
- [ ] Register WhatsApp methods in RPC registry
- [ ] Add validation with Zod schemas
- [ ] Test RPC endpoint: `/api/rpc`

#### 8.7 Testing

- [ ] Unit tests for WhatsApp service
- [ ] Integration tests for queue worker
- [ ] E2E test for registration workflow
- [ ] Test with real phone numbers
- [ ] Test rate limiting

### Technical Requirements

- WhatsApp Business API (Twilio or Meta)
- Phone number validation (libphonenumber-js - already installed)
- BullMQ queue (already configured)
- Prisma ORM for database

### Environment Variables

```env
WHATSAPP_API_KEY="your-api-key"
WHATSAPP_PHONE_NUMBER="+1234567890"
WHATSAPP_API_PROVIDER="twilio" # or "meta"
WHATSAPP_WEBHOOK_URL="https://yourdomain.com/api/whatsapp/webhook"
```

### Files to Create

- `src/lib/whatsapp/service.ts`
- `src/lib/whatsapp/client.ts`
- `src/lib/whatsapp/templates/`
- `src/lib/whatsapp/rpc/sendMessage.ts`
- `services/whatsapp-worker/worker.ts`
- `services/whatsapp-worker/config.ts`
- `tests/whatsapp/` (all test files)
- `docs/whatsapp/README.md`

### Acceptance Criteria

- [ ] WhatsApp messages send successfully via API
- [ ] Messages are queued and processed by worker
- [ ] Templates support both Arabic and English
- [ ] Phone numbers are validated before sending
- [ ] All sends are logged to database
- [ ] Error handling works correctly
- [ ] RPC endpoint accepts WhatsApp requests

---

---

## Task 10: Navigation Improvements

### Status: � In Progress (Language Switcher Animated, Segment Pending)

### Description

Improve the main navigation component (`src/components/navigation`) by adding a generic "Segment" section to the "Entrepreneurship and Incubators" tab and enhancing the language switcher animation.

### Subtasks

#### 10.1 Add Segment to Entrepreneurship Tab

- [x] Add a "Segment" section to the Entrepreneurship and Incubators dropdown/tab.
- [x] Ensure it matches the "Collaborators" section style (registerCompany, partnersList).
- [x] Update `src/components/navigation` components.

#### 10.2 Animate Language Switcher

- [x] Add smooth animation for language switching.
- [x] Implement cursor/highlight movement effect between languages.
- [x] Add fade effect for the non-selected language.

---

## Task 11: News Section UI Enhancements

### Status: ✅ Completed

### Description

Improve the visual distinction between headlines and body text in the News section to enhance readability.

### Subtasks

#### 11.1 Typography Updates

- [ ] Increase font weight/size contrast between News Headlines and Body Text.
- [ ] Ensure proper spacing/margin between elements.
- [ ] Check `src/components/news.tsx` or related components.

---

## Task 12: Fix Registration Form Data Persistence

### Status: ✅ Completed

### Description

Debug and fix the issue where registration form data (Collaborators and Innovators) is stored locally but appears empty in the form fields upon reloading or navigating back.

### Subtasks

#### 12.1 Debug Collaborator Form

- [ ] Investigate `src/features/collaborators` form components.
- [ ] Check local storage retrieval logic.
- [ ] Ensure form state inputs are correctly bound to retrieved data.

#### 12.2 Debug Innovator Form

- [ ] Investigate `src/features/innovators` form components.
- [ ] Apply similar fixes as Collaborator form.

---

**Last Updated**: January 2026
**Project**: Misurata Center for Entrepreneurship & Business Incubators
**Version**: 1.2

---

## Task 13: AI-Powered Form Redesign

### Status: ✅ Completed

### Priority: 🔴 HIGH

### Description

Implement the comprehensive AI-driven redesign of the multi-step forms for Collaborators and Innovators. This includes creating a new foundation layer (types, store, hooks), shared components, and transforming the existing forms to use the new infrastructure.

Detailed plan available in: `ai_form_redesign_plan.md`

### Subtasks

- [ ] Phase 1: Foundation Layer (Types, Store, Hooks)
- [ ] Phase 2: Shared Components Library
- [ ] Phase 3: Collaborators Form Transformation
- [ ] Phase 4: Innovators Form Transformation
- [ ] Phase 5: Design Enhancement
- [ ] Phase 6: Testing & Optimization
