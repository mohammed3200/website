# Project Tasks Roadmap
**Misurata Center for Entrepreneurship & Business Incubators**

---

## Table of Contents
1. [Task 1: Finalize Email System Templates](#task-1-finalize-email-system-templates)
2. [Task 2: Build WhatsApp Integration System](#task-2-build-whatsapp-integration-system)
3. [Task 3: Improve and Standardize Button Designs](#task-3-improve-and-standardize-button-designs)
4. [Task 4: Improve Card Layouts](#task-4-improve-card-layouts)
5. [Task 5: Integrate Email & WhatsApp for Registration Workflows](#task-5-integrate-email--whatsapp-for-registration-workflows)
6. [Task 6: Standardize File Naming Convention](#task-6-standardize-file-naming-convention)

---

## Overview

This document outlines the development tasks for enhancing the Misurata Center for Entrepreneurship & Business Incubators platform. The tasks are organized by priority and include detailed subtasks, technical requirements, and acceptance criteria.

**Tech Stack Reference:**
- Frontend: Next.js 15.1.2, React 19, TypeScript, Tailwind CSS
- Backend: Hono.js, Prisma ORM
- Database: MySQL
- Email: Nodemailer, React Email
- Queue: BullMQ, Redis
- Authentication: NextAuth.js

---

## Task 1: Finalize Email System Templates

### Status: 🟡 In Progress

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

## Task 2: Build WhatsApp Integration System

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

## Task 3: Improve and Standardize Button Designs

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
const buttonVariants = cva(
  "base-button-classes",
  {
    variants: {
      variant: {
        primary: "...",
        secondary: "...",
        outline: "...",
        danger: "...",
        ghost: "...",
        link: "...",
        send: "..." // Distinctive style
      },
      size: {
        sm: "...",
        md: "...",
        lg: "...",
        xl: "...",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)
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

## Task 4: Improve Card Layouts

### Status: 🔴 Not Started

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

## Task 5: Integrate Email & WhatsApp for Registration Workflows

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

## Task 6: Standardize File Naming Convention

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

| Task | Estimated Time | Priority |
|------|----------------|----------|
| Task 1: Email Templates | 8-12 hours | High |
| Task 2: WhatsApp System | 16-24 hours | High |
| Task 3: Button Design | 8-12 hours | Medium |
| Task 4: Card Layouts | 12-16 hours | High |
| Task 5: Workflow Integration | 16-20 hours | High |
| Task 6: Naming Convention | 4-6 hours (documentation) | Low |

**Total Estimated Time**: 64-90 hours

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

**Last Updated**: November 7, 2025  
**Project**: Misurata Center for Entrepreneurship & Business Incubators  
**Version**: 1.0
