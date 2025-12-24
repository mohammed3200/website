# Admin Notification Tests

This directory contains comprehensive test coverage for the administrator notification system.

## Test File

- `admin-notifications.test.ts` - Full test suite for admin notification functionality

## Running Tests

### Run all tests
```powershell
pnpm test
```

### Run only notification tests
```powershell
pnpm test tests/notifications
```

### Run tests in watch mode
```powershell
pnpm test -- --watch tests/notifications
```

### Run with coverage
```powershell
pnpm test -- --coverage tests/notifications
```

## Test Coverage

The test suite covers the following areas:

### 1. Core Functionality (`notifyAdmins`)
- ✅ Sending notifications to multiple eligible admins
- ✅ Respecting admin notification preferences
- ✅ Permission-based filtering
- ✅ Error handling
- ✅ Handling cases with no eligible admins

### 2. Notification Type Functions
- ✅ `notifyNewCollaborator` - New collaborator registration notifications
- ✅ `notifyNewInnovator` - New innovator project submissions
- ✅ `notifySystemError` - System error alerts
- ✅ `notifySecurityAlert` - Security-related alerts
- ✅ `notifyFailedLoginAttempts` - Failed login attempt warnings

### 3. Notification Preferences
- ✅ Skipping notifications when preferences are disabled
- ✅ Sending notifications when preferences are enabled
- ✅ Default behavior when preferences are not set
- ✅ Individual preference types:
  - `emailNewSubmissions`
  - `emailStatusChanges`
  - `emailSystemErrors`
  - `emailSecurityAlerts`
  - `emailUserActivity`
  - `emailBackups`

### 4. Priority Levels
- ✅ URGENT priority for system errors and security alerts
- ✅ HIGH priority for new submissions and failed login attempts
- ✅ NORMAL priority for general notifications
- ✅ LOW priority for non-critical notifications

## Mocking Strategy

The tests use Jest mocks for:

1. **Database (`@/lib/db`)**: Mocks Prisma client operations
   - `db.user.findMany` - Finding eligible admin users
   - `db.adminNotification.create` - Creating notifications

2. **Email Service (`@/lib/email/service`)**: Mocks email sending functionality
   - Returns successful send results by default

## Test Data Structure

### Mock Admin User
```typescript
{
  id: 'admin-1',
  name: 'Admin Name',
  email: 'admin@test.com',
  isActive: true,
  notificationPreferences: {
    emailNewSubmissions: true,
    emailSystemErrors: true,
    // ... other preferences
  },
  role: {
    permissions: [
      {
        permission: {
          resource: 'dashboard',
          action: 'manage',
        },
      },
    ],
  },
}
```

### Notification Data
```typescript
{
  type: 'NEW_COLLABORATOR',
  title: 'New Collaborator Registration',
  message: 'A new collaborator has registered',
  actionUrl: '/admin/collaborators?id=123',
  priority: NotificationPriority.HIGH,
  data: { /* additional context */ },
  requiredPermission: 'collaborators:manage',
}
```

## Expected Test Results

When running the full test suite, you should see:

```
PASS  tests/notifications/admin-notifications.test.ts
  Admin Notifications
    notifyAdmins
      ✓ should send notifications to eligible admins
      ✓ should respect admin notification preferences
      ✓ should handle permission-based filtering
      ✓ should handle errors gracefully
      ✓ should return early if no admins found
    notifyNewCollaborator
      ✓ should create notification with correct data
    notifyNewInnovator
      ✓ should create notification with correct data
    notifySystemError
      ✓ should create urgent notification for system errors
    notifySecurityAlert
      ✓ should create urgent notification for security alerts
    notifyFailedLoginAttempts
      ✓ should create high priority notification for failed logins
    Notification Preferences
      ✓ should skip notifications when emailSystemErrors is false
      ✓ should send notifications when emailSecurityAlerts is true
      ✓ should send all notifications when preferences are not set
    Priority Levels
      ✓ should set URGENT priority for system errors
      ✓ should set HIGH priority for new submissions

Test Suites: 1 passed, 1 total
Tests:       15 passed, 15 total
```

## Adding New Tests

When adding new notification types or features, follow this pattern:

```typescript
describe('notifyNewFeature', () => {
  it('should create notification with correct data', async () => {
    // 1. Setup mock admin users
    const mockAdmin = [{ /* admin data */ }];
    (db.user.findMany as jest.Mock).mockResolvedValue(mockAdmin);
    (db.adminNotification.create as jest.Mock).mockResolvedValue({
      id: 'notification-1',
    });

    // 2. Call the notification function
    const result = await notifyNewFeature({ /* data */ });

    // 3. Assert expectations
    expect(result.sent).toBe(1);
    expect(db.adminNotification.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        type: 'NEW_FEATURE',
        // ... other expected fields
      }),
    });
  });
});
```

## Troubleshooting

### Tests fail with "Cannot find module '@/lib/db'"
- Ensure `tsconfig.json` has the correct path alias configuration
- Run `npx prisma generate` to generate Prisma client

### Mock not working
- Check that jest.clearAllMocks() is called in beforeEach
- Verify mock implementation matches actual function signature

### Database connection errors
- Tests should NOT connect to real database
- Verify all database calls are properly mocked

## Related Files

- Source: `src/lib/notifications/admin-notifications.ts`
- Email Template: `src/lib/email/templates/AdminNotification.tsx`
- Database Schema: `prisma/schema.prisma` (AdminNotification model)
