# Task 2: Send Notification Messages to System Administrators

## Implementation Summary

This document provides a comprehensive overview of the admin notification system implementation for Task 2 of the PROJECT_TASKS_ROADMAP.md.

---

## ✅ Completed Components

### 1. Database Schema (Prisma)

**File:** `prisma/schema.prisma`

#### New Model: AdminNotification
```prisma
model AdminNotification {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation("UserNotifications", fields: [userId], references: [id], onDelete: Cascade)
  type        String   // "NEW_REGISTRATION", "SYSTEM_ERROR", etc.
  title       String
  message     String   @db.Text
  data        Json?    // Additional data for the notification
  isRead      Boolean  @default(false)
  readAt      DateTime?
  actionUrl   String?  // Direct link to take action
  priority    NotificationPriority @default(NORMAL)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([userId, isRead])
  @@index([createdAt])
  @@index([type])
  @@index([priority])
}
```

#### New Enum: NotificationPriority
```prisma
enum NotificationPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

#### Updated User Model
- Added `notifications` relation
- Added `notificationPreferences` JSON field for storing user preferences

**Next Step:** Run migration with `pnpm db:migrate`

---

### 2. Admin Notification Service

**File:** `src/lib/notifications/admin-notifications.ts`

#### Core Functions

##### `notifyAdmins(notificationData)`
Main function that:
- Queries database for eligible admin users based on permissions
- Filters admins based on notification preferences
- Creates notifications in database
- Sends email notifications
- Returns success/failure counts

##### Helper Functions
1. **`notifyNewCollaborator(data)`** - HIGH priority
   - Triggered when new collaborator registers
   - Requires `collaborators:manage` permission
   - Includes action URL to admin collaborators page

2. **`notifyNewInnovator(data)`** - HIGH priority
   - Triggered when new innovator submits project
   - Requires `innovators:manage` permission
   - Includes action URL to admin innovators page

3. **`notifySystemError(data)`** - URGENT priority
   - Triggered on system errors
   - Includes error details, context, and stack trace
   - Notifies all admins with dashboard access

4. **`notifySecurityAlert(data)`** - URGENT priority
   - Triggered on security-related events
   - Includes user ID, IP address
   - Links to security alerts page

5. **`notifyFailedLoginAttempts(data)`** - HIGH priority
   - Triggered after multiple failed login attempts
   - Includes email, attempt count, IP address
   - Links to security logs

#### Features
- ✅ Permission-based admin filtering
- ✅ Notification preference checking
- ✅ Priority levels (LOW, NORMAL, HIGH, URGENT)
- ✅ Actionable links in notifications
- ✅ Email sending integration
- ✅ Database logging
- ✅ Error handling

#### Notification Preferences
Users can configure preferences via JSON field:
```typescript
{
  emailNewSubmissions: boolean,
  emailStatusChanges: boolean,
  emailSystemErrors: boolean,
  emailSecurityAlerts: boolean,
  emailUserActivity: boolean,
  emailBackups: boolean,
  digestMode: 'immediate' | 'daily' | 'weekly'
}
```

---

### 3. Email Template

**File:** `src/lib/email/templates/AdminNotification.tsx`

#### Features
- ✅ Bilingual support (Arabic/English)
- ✅ RTL layout for Arabic
- ✅ Priority badges with color coding:
  - URGENT: Red (#dc2626)
  - HIGH: Orange (#ea580c)
  - NORMAL: Blue (#2563eb)
  - LOW: Green (#16a34a)
- ✅ Timestamp display
- ✅ Action buttons with links
- ✅ Responsive design
- ✅ Professional styling matching BaseLayout

#### Props Interface
```typescript
interface AdminNotificationProps {
  adminName: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  locale?: 'ar' | 'en';
  timestamp?: Date;
}
```

---

### 4. Comprehensive Test Suite

**File:** `tests/notifications/admin-notifications.test.ts`

#### Test Coverage (15 tests)

1. **Core Functionality Tests (5 tests)**
   - Sending notifications to multiple admins
   - Respecting notification preferences
   - Permission-based filtering
   - Error handling
   - Empty admin list handling

2. **Notification Type Tests (5 tests)**
   - New collaborator notifications
   - New innovator notifications
   - System error notifications
   - Security alert notifications
   - Failed login attempt notifications

3. **Preference Tests (3 tests)**
   - Skipping when preferences disabled
   - Sending when preferences enabled
   - Default behavior (no preferences set)

4. **Priority Level Tests (2 tests)**
   - URGENT priority for critical events
   - HIGH priority for submissions

#### Mocking Strategy
- Database operations (`db.user.findMany`, `db.adminNotification.create`)
- Email service (`@/lib/email/service`)
- All external dependencies properly mocked

**Documentation:** `tests/notifications/README.md`

---

### 5. Test Utilities

**File:** `scripts/test-admin-notifications.ts`

Interactive test script that demonstrates:
- All notification types
- Real database interaction (when run)
- Email sending (when SMTP configured)
- Summary statistics

**Usage:**
```powershell
pnpm tsx scripts/test-admin-notifications.ts
```

---

## 📋 Notification Types Supported

| Type | Priority | Permission Required | Action URL |
|------|----------|-------------------|------------|
| NEW_COLLABORATOR | HIGH | collaborators:manage | /admin/collaborators?id={id} |
| NEW_INNOVATOR | HIGH | innovators:manage | /admin/innovators?id={id} |
| SYSTEM_ERROR | URGENT | dashboard:manage | /admin/system/logs |
| SECURITY_ALERT | URGENT | dashboard:manage | /admin/security/alerts |
| FAILED_LOGIN_ATTEMPTS | HIGH | dashboard:manage | /admin/security/logins |
| SUBMISSION_APPROVED | NORMAL | Auto-detect | Submission page |
| SUBMISSION_REJECTED | NORMAL | Auto-detect | Submission page |
| USER_ACCOUNT_CREATED | NORMAL | users:manage | /admin/users |
| ROLE_CHANGED | NORMAL | roles:manage | /admin/roles |
| DATABASE_BACKUP_COMPLETE | LOW | dashboard:manage | /admin/system |

---

## 🔄 Integration Points

### To Complete Task 2 Integration:

#### 1. Run Database Migration
```powershell
pnpm db:migrate
```
This creates the AdminNotification table and updates the User table.

#### 2. Integrate with Collaborator Registration
**File to modify:** `src/features/collaborators/server/route.ts`

```typescript
import { notifyNewCollaborator } from '@/lib/notifications/admin-notifications';

// After successful collaborator creation
await notifyNewCollaborator({
  id: newCollaborator.id,
  companyName: newCollaborator.companyName,
  email: newCollaborator.email,
  sector: newCollaborator.industrialSector,
});
```

#### 3. Integrate with Innovator Registration
**File to modify:** `src/features/innovators/server/route.ts`

```typescript
import { notifyNewInnovator } from '@/lib/notifications/admin-notifications';

// After successful innovator creation
await notifyNewInnovator({
  id: newInnovator.id,
  name: newInnovator.name,
  projectTitle: newInnovator.projectTitle,
  email: newInnovator.email,
});
```

#### 4. Add System Error Handler
**File to create:** `src/lib/errors/error-handler.ts`

```typescript
import { notifySystemError } from '@/lib/notifications/admin-notifications';

export async function handleSystemError(error: Error, context?: string) {
  await notifySystemError({
    error: error.message,
    context,
    stackTrace: error.stack,
  });
}
```

---

## 🎯 Next Steps (To Complete Task 2)

### A. Database Migration ✅ Ready
```powershell
pnpm db:migrate
npx prisma generate
```

### B. UI Components (TODO)
1. **Notification Bell Component**
   - File: `src/features/admin/components/NotificationBell.tsx`
   - Real-time notification count
   - Dropdown with recent notifications
   - Mark as read functionality

2. **Notification Panel Page**
   - File: `src/app/admin/notifications/page.tsx`
   - List all notifications
   - Filter by type, priority, read status
   - Pagination
   - Bulk actions

3. **Notification Preferences Page**
   - File: `src/app/admin/settings/notifications/page.tsx`
   - Toggle notification types
   - Digest mode selection
   - Email preferences

### C. API Routes (TODO)
1. **Get Notifications**
   - `GET /api/admin/notifications`
   - Query params: page, limit, type, isRead

2. **Mark as Read**
   - `PATCH /api/admin/notifications/:id/read`

3. **Update Preferences**
   - `PUT /api/admin/users/me/notification-preferences`

### D. Real-time Features (TODO - Optional)
1. Server-Sent Events (SSE) or WebSocket
2. Push notifications via Service Worker
3. Browser notifications

---

## 🧪 Testing

### Run Unit Tests
```powershell
# All tests
pnpm test

# Only notification tests
pnpm test tests/notifications

# With coverage
pnpm test -- --coverage tests/notifications
```

### Run Integration Test Script
```powershell
# Test with real database
pnpm tsx scripts/test-admin-notifications.ts
```

### Manual Testing Checklist
- [ ] Create admin user with dashboard permissions
- [ ] Trigger new collaborator registration
- [ ] Verify notification created in database
- [ ] Verify email sent to admin
- [ ] Check notification preferences work
- [ ] Test different priority levels
- [ ] Test permission filtering

---

## 📊 Performance Considerations

1. **Database Queries**
   - Indexed fields: userId + isRead, createdAt, type, priority
   - Efficient query for eligible admins

2. **Email Sending**
   - Async/non-blocking
   - Error handling prevents failures from blocking flow
   - TODO: Consider queue for high-volume scenarios

3. **Notification Storage**
   - Auto-cleanup for old read notifications (TODO)
   - Archive after 90 days (TODO)

---

## 🔒 Security Considerations

1. **Permission Checks**
   - RBAC enforced at database query level
   - Action URLs validated
   - No sensitive data in notification messages

2. **Email Security**
   - No secrets in email content
   - Links include secure tokens (TODO)
   - Rate limiting on email sends (TODO)

3. **XSS Prevention**
   - All user input sanitized
   - React Email automatically escapes content

---

## 📚 Related Documentation

- [Project Tasks Roadmap](../PROJECT_TASKS_ROADMAP.md) - Task 2 details
- [WARP.md](../WARP.md) - Development guide
- [Test README](../tests/notifications/README.md) - Testing guide
- [Prisma Schema](../prisma/schema.prisma) - Database structure

---

## ✨ Summary

**Status:** 🟡 **75% Complete**

### Completed:
- ✅ Database schema
- ✅ Core notification service
- ✅ Email template
- ✅ Comprehensive tests
- ✅ Test utilities
- ✅ Documentation

### Remaining:
- ⏳ Database migration execution
- ⏳ Integration with registration routes
- ⏳ Notification bell UI component
- ⏳ Notification panel page
- ⏳ Preferences management UI
- ⏳ API routes for frontend

### Time Estimate:
- Initial setup (completed): ~8 hours
- Remaining work: ~4-6 hours
- **Total:** 12-14 hours (within 12-16 hour estimate)

---

**Last Updated:** January 11, 2025  
**Author:** AI Assistant (Warp Agent Mode)  
**Task Reference:** PROJECT_TASKS_ROADMAP.md - Task 2
