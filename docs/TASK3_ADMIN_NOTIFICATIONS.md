# Task 3: Admin Notification System (Email & WhatsApp)

**Priority**: High  
**Status**: 🔴 Not Started  
**Estimated Time**: 12-16 hours  
**Dependencies**: Task 1 (Email Templates) ✅ Complete

---

## 📋 Overview

Create a comprehensive notification system that alerts administrators/supervisors when:
1. **New member registration** - Collaborator or Innovator submits a request
2. **Support needed** - Member requests assistance
3. **Status updates** - Actions taken on member requests (approval/rejection)

Notifications will be sent via **both Email and WhatsApp** to ensure supervisors never miss important updates.

---

## 🎯 Objectives

### Primary Goals
- ✅ Notify admins immediately when new registrations arrive
- ✅ Alert supervisors when members need support
- ✅ Inform admins of all status changes (approvals/rejections)
- ✅ Support both Arabic and English notifications
- ✅ Dual channel delivery (Email + WhatsApp)

### Secondary Goals
- ✅ Configurable admin notification preferences
- ✅ Notification history and tracking
- ✅ Priority levels for different notification types
- ✅ Bulk notification support for multiple admins

---

## 📧 Notification Types

### 1. New Registration Notification
**Trigger**: When a collaborator or innovator submits their registration  
**Recipients**: All admins with "manage_submissions" permission  
**Priority**: High  

**Information Included**:
- Member type (Collaborator/Innovator)
- Name/Company name
- Contact details (email, phone)
- Submission ID
- Submission date/time
- Quick action links (View, Approve, Reject)

### 2. Support Request Notification
**Trigger**: When a member requests assistance  
**Recipients**: All admins with "support" permission  
**Priority**: Medium  

**Information Included**:
- Member name
- Request type
- Message/Description
- Request ID
- Date/time
- Quick action link (Respond)

### 3. Status Change Notification
**Trigger**: When an admin approves/rejects a request  
**Recipients**: Supervisors/managers  
**Priority**: Low  

**Information Included**:
- Member name
- Action taken (Approved/Rejected)
- Admin who performed action
- Date/time
- Reason (if rejection)

---

## 📁 File Structure

### Email Templates
```
src/lib/email/templates/
├── AdminNewRegistration.tsx       // New registration alert
├── AdminSupportRequest.tsx        // Support request alert
└── AdminStatusChange.tsx          // Status change notification
```

### WhatsApp Templates
```
src/lib/whatsapp/templates/
├── admin-new-registration.ts      // New registration alert
├── admin-support-request.ts       // Support request alert
└── admin-status-change.ts         // Status change notification
```

### Services
```
src/lib/notifications/
├── admin-notification-service.ts  // Main admin notification service
├── types.ts                       // TypeScript interfaces
└── config.ts                      // Notification configuration
```

---

## 🏗️ Implementation Plan

### Phase 1: Email Templates (3-4 hours)

#### 1.1 Create AdminNewRegistration Template
```typescript
// src/lib/email/templates/AdminNewRegistration.tsx
interface AdminNewRegistrationProps {
  memberType: 'collaborator' | 'innovator';
  memberName: string;
  companyName?: string;
  email: string;
  phone: string;
  submissionId: string;
  submittedAt: Date;
  viewLink: string;
  approveLink: string;
  rejectLink: string;
  locale?: 'ar' | 'en';
}

export const AdminNewRegistration = ({ ... }) => {
  // Template with:
  // - Alert header
  // - Member information table
  // - Quick action buttons
  // - Submission details
};
```

#### 1.2 Create AdminSupportRequest Template
```typescript
// src/lib/email/templates/AdminSupportRequest.tsx
interface AdminSupportRequestProps {
  memberName: string;
  memberType: 'collaborator' | 'innovator';
  requestType: string;
  message: string;
  requestId: string;
  requestedAt: Date;
  respondLink: string;
  locale?: 'ar' | 'en';
}
```

#### 1.3 Create AdminStatusChange Template
```typescript
// src/lib/email/templates/AdminStatusChange.tsx
interface AdminStatusChangeProps {
  memberName: string;
  action: 'approved' | 'rejected';
  performedBy: string;
  performedAt: Date;
  reason?: string;
  locale?: 'ar' | 'en';
}
```

### Phase 2: WhatsApp Templates (2-3 hours)

#### 2.1 New Registration Message
```typescript
// src/lib/whatsapp/templates/admin-new-registration.ts
export const adminNewRegistration = {
  ar: (data) => `
🔔 تسجيل جديد!

النوع: ${data.type}
الاسم: ${data.name}
البريد: ${data.email}
الرقم: ${data.submissionId}

افتح اللوحة: ${data.dashboardLink}
  `,
  en: (data) => `
🔔 New Registration!

Type: ${data.type}
Name: ${data.name}
Email: ${data.email}
ID: ${data.submissionId}

Open Dashboard: ${data.dashboardLink}
  `
};
```

#### 2.2 Support Request Message
```typescript
export const adminSupportRequest = {
  ar: (data) => `
❓ طلب دعم جديد

من: ${data.memberName}
النوع: ${data.requestType}
الرسالة: ${data.message}

الرد: ${data.respondLink}
  `,
  en: (data) => `
❓ New Support Request

From: ${data.memberName}
Type: ${data.requestType}
Message: ${data.message}

Respond: ${data.respondLink}
  `
};
```

#### 2.3 Status Change Message
```typescript
export const adminStatusChange = {
  ar: (data) => `
✅ تحديث حالة

العضو: ${data.memberName}
الإجراء: ${data.action}
بواسطة: ${data.performedBy}
التاريخ: ${data.date}
  `,
  en: (data) => `
✅ Status Update

Member: ${data.memberName}
Action: ${data.action}
By: ${data.performedBy}
Date: ${data.date}
  `
};
```

### Phase 3: Admin Notification Service (4-5 hours)

#### 3.1 Create Service
```typescript
// src/lib/notifications/admin-notification-service.ts
import { emailService } from '@/lib/email/service';
import { whatsappService } from '@/lib/whatsapp/service';
import { db } from '@/lib/db';

class AdminNotificationService {
  /**
   * Notify admins of new registration
   */
  async notifyNewRegistration(data: {
    memberType: 'collaborator' | 'innovator';
    memberId: string;
    memberData: any;
    locale?: 'ar' | 'en';
  }) {
    // 1. Get admins with permission
    const admins = await this.getAdminsWithPermission('manage_submissions');
    
    // 2. Send email to each admin
    for (const admin of admins) {
      if (admin.emailNotifications) {
        await emailService.sendAdminNewRegistration({
          adminEmail: admin.email,
          adminName: admin.name,
          ...data,
        });
      }
      
      // 3. Send WhatsApp if enabled
      if (admin.whatsappNotifications && admin.phoneNumber) {
        await whatsappService.sendAdminNotification({
          to: admin.phoneNumber,
          template: 'new_registration',
          data,
        });
      }
    }
    
    // 4. Log notification
    await this.logNotification({
      type: 'NEW_REGISTRATION',
      recipients: admins.map(a => a.id),
      data,
    });
  }

  /**
   * Notify admins of support request
   */
  async notifySupportRequest(data: {
    memberId: string;
    memberName: string;
    requestType: string;
    message: string;
    locale?: 'ar' | 'en';
  }) {
    // Similar implementation
  }

  /**
   * Notify admins of status change
   */
  async notifyStatusChange(data: {
    memberId: string;
    memberName: string;
    action: 'approved' | 'rejected';
    performedBy: string;
    reason?: string;
    locale?: 'ar' | 'en';
  }) {
    // Similar implementation
  }

  /**
   * Get admins with specific permission
   */
  private async getAdminsWithPermission(permission: string) {
    return await db.user.findMany({
      where: {
        isActive: true,
        role: {
          permissions: {
            some: {
              permission: {
                name: permission,
              },
            },
          },
        },
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
  }

  /**
   * Log notification for tracking
   */
  private async logNotification(data: any) {
    return await db.notificationLog.create({
      data: {
        ...data,
        sentAt: new Date(),
      },
    });
  }
}

export const adminNotificationService = new AdminNotificationService();
```

### Phase 4: Database Models (1-2 hours)

#### 4.1 Add Notification Models
```prisma
// prisma/schema.prisma

model NotificationLog {
  id          String   @id @default(cuid())
  type        NotificationType
  recipients  Json     // Array of admin IDs
  data        Json     // Notification data
  channels    Json     // ['email', 'whatsapp']
  sentAt      DateTime @default(now())
  status      String   // 'sent', 'failed'
  error       String?  @db.Text
  createdAt   DateTime @default(now())
  
  @@index([type])
  @@index([sentAt])
}

model NotificationPreference {
  id                    String  @id @default(cuid())
  userId                String  @unique
  user                  User    @relation(fields: [userId], references: [id])
  emailNotifications    Boolean @default(true)
  whatsappNotifications Boolean @default(false)
  newRegistrations      Boolean @default(true)
  supportRequests       Boolean @default(true)
  statusChanges         Boolean @default(false)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
}

enum NotificationType {
  NEW_REGISTRATION
  SUPPORT_REQUEST
  STATUS_CHANGE
  SYSTEM_ALERT
}
```

### Phase 5: Integration (2-3 hours)

#### 5.1 Update Registration Flow
```typescript
// src/features/collaborators/api/register.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // 1. Save to database
  const collaborator = await db.collaborator.create({
    data: { ...validated, status: 'PENDING' }
  });
  
  // 2. Send confirmation to member
  await emailService.sendSubmissionConfirmation(...);
  
  // 3. 🆕 Notify admins
  await adminNotificationService.notifyNewRegistration({
    memberType: 'collaborator',
    memberId: collaborator.id,
    memberData: collaborator,
    locale: data.locale || 'en',
  });
  
  return Response.json({ success: true });
}
```

#### 5.2 Update Admin Actions
```typescript
// src/app/api/admin/collaborator/approve/[id]/route.ts
export async function POST(request: Request, { params }) {
  const session = await getSession();
  
  // 1. Update status
  const collaborator = await db.collaborator.update({
    where: { id: params.id },
    data: { status: 'APPROVED' }
  });
  
  // 2. Notify member
  await emailService.sendStatusUpdate(...);
  
  // 3. 🆕 Notify supervisors
  await adminNotificationService.notifyStatusChange({
    memberId: collaborator.id,
    memberName: collaborator.companyName,
    action: 'approved',
    performedBy: session.user.name,
    locale: 'en',
  });
  
  return Response.json({ success: true });
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// tests/notifications/admin-notification-service.test.ts
describe('AdminNotificationService', () => {
  it('should notify all admins with permission', async () => {
    // Test
  });
  
  it('should respect admin notification preferences', async () => {
    // Test
  });
  
  it('should log all notifications', async () => {
    // Test
  });
});
```

### Integration Tests
```typescript
// Test full flow
describe('Registration with Admin Notification', () => {
  it('should notify admins when member registers', async () => {
    // 1. Submit registration
    // 2. Verify admin email sent
    // 3. Verify admin WhatsApp sent
    // 4. Verify notification logged
  });
});
```

---

## 🎨 Email Template Design

### AdminNewRegistration Layout
```
┌─────────────────────────────────┐
│  🔔 New Registration Alert      │ <- Orange header
├─────────────────────────────────┤
│ A new member has registered!    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Type: Collaborator          │ │
│ │ Name: Ahmed Tech Co.        │ │
│ │ Email: ahmed@example.com    │ │
│ │ Phone: +218 91 234 5678     │ │
│ │ ID: CLB-12345               │ │
│ │ Date: Nov 8, 2025 10:30     │ │
│ └─────────────────────────────┘ │
│                                 │
│ [View Details] [Approve] [Reject] │
│                                 │
│ Please review and take action.  │
└─────────────────────────────────┘
```

---

## ✅ Acceptance Criteria

### Email Notifications
- [ ] New registration emails sent to all admins
- [ ] Support request emails sent to support admins
- [ ] Status change emails sent to supervisors
- [ ] All emails are bilingual (Arabic/English)
- [ ] Quick action links work correctly
- [ ] Email preferences are respected

### WhatsApp Notifications
- [ ] WhatsApp messages sent successfully
- [ ] Messages are concise and clear
- [ ] Links are clickable
- [ ] Both languages supported
- [ ] WhatsApp preferences are respected

### Database
- [ ] NotificationLog tracks all notifications
- [ ] NotificationPreference allows customization
- [ ] Queries are efficient (indexed)
- [ ] No duplicate notifications sent

### Integration
- [ ] Registration flow triggers admin notification
- [ ] Support requests trigger admin notification
- [ ] Status changes trigger admin notification
- [ ] No errors in production
- [ ] Notifications sent within 5 seconds

---

## 📊 Success Metrics

### Performance
- Notification sent within **< 5 seconds** of trigger
- Email delivery rate **> 95%**
- WhatsApp delivery rate **> 98%**

### Reliability
- **Zero** missed notifications
- **99.9%** uptime for notification service
- Automatic retry on failure

### User Satisfaction
- Admins receive timely notifications
- No spam/excessive notifications
- Preferences respected

---

## 🔧 Configuration

### Environment Variables
```env
# Admin notification settings
ADMIN_EMAIL_NOTIFICATIONS=true
ADMIN_WHATSAPP_NOTIFICATIONS=true
ADMIN_NOTIFICATION_QUEUE=admin-notifications
NOTIFICATION_RETRY_ATTEMPTS=3
NOTIFICATION_RETRY_DELAY=5000
```

### Admin Dashboard Settings
```typescript
// Admin can configure in dashboard:
{
  emailNotifications: true,
  whatsappNotifications: false,
  newRegistrations: true,
  supportRequests: true,
  statusChanges: false,
}
```

---

## 🚀 Deployment Checklist

- [ ] All email templates created and tested
- [ ] All WhatsApp templates created and tested
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Integration points updated
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Documentation complete
- [ ] Admin preferences UI ready
- [ ] Production deployment successful

---

## 📚 Documentation

### For Admins
- How to manage notification preferences
- What each notification type means
- How to respond to notifications
- Troubleshooting guide

### For Developers
- Service API documentation
- Template customization guide
- Adding new notification types
- Testing guide

---

## 🔜 Future Enhancements

- [ ] SMS notifications (optional third channel)
- [ ] Notification scheduling (delay delivery)
- [ ] Digest mode (batch notifications)
- [ ] Priority routing (urgent vs normal)
- [ ] Custom notification rules
- [ ] Analytics dashboard for notifications

---

**Priority**: High  
**Dependencies**: Task 1 (Complete), Task 2 (WhatsApp - optional)  
**Blocks**: None  
**Estimated Completion**: After 12-16 hours of focused work

**Ready to implement after Task 2 (WhatsApp) is complete!**
