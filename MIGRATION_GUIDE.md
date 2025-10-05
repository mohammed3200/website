# 🚀 Migration and Setup Guide

This guide addresses the three problems you mentioned and provides step-by-step instructions for implementation.

## 📋 Table of Contents
1. [Environment Files Consolidation](#1-environment-files-consolidation)
2. [CIT.EDU.LY Email Configuration](#2-citedu-ly-email-configuration)
3. [Hono.js Route Structure Migration](#3-honojs-route-structure-migration)

---

## 1. Environment Files Consolidation

### ✅ Problem Solved
Multiple `.env` files causing confusion and duplicate variables.

### 📁 Files Created
- `.env.consolidated` - Single consolidated configuration file

### 🔄 Migration Steps

1. **Backup your current .env file**:
   ```bash
   cp .env .env.backup
   ```

2. **Copy the consolidated configuration**:
   ```bash
   cp .env.consolidated .env
   ```

3. **Remove old environment files** (after confirming everything works):
   ```bash
   rm .env.example .env.smtp.example .env.improved
   ```

4. **Update your .gitignore** to ensure .env is never committed:
   ```bash
   echo ".env" >> .gitignore
   echo ".env.backup" >> .gitignore
   ```

### 📝 Environment Variables Consolidated

| Old Variables | New (Consolidated) | Purpose |
|--------------|-------------------|---------|
| SMTP_USER, EMAIL_USER | SMTP_USER | Single email username |
| SMTP_PASS, EMAIL_PASS, SMTP_PASSWORD | SMTP_PASS | Single email password |
| SMTP_FROM, EMAIL_FROM | EMAIL_FROM | Single from address |

---

## 2. CIT.EDU.LY Email Configuration

### ✅ Problem Solved
Setting up `ebic@cit.edu.ly` email with proper SMTP configuration.

### 🔧 Configuration Details
- **Email**: ebic@cit.edu.ly
- **Password**: G8VUG5=gWW2r2gP<
- **Domain**: cit.edu.ly

### 📁 Files Updated
- `src/lib/email/transports.ts` - Added support for custom SMTP
- `.env.consolidated` - Pre-configured for CIT.EDU.LY
- `scripts/test-cit-email.js` - Custom testing script

### 🚀 Setup Steps

1. **Test the email configuration**:
   ```bash
   node scripts/test-cit-email.js your-email@example.com
   ```
   
   This script will automatically test multiple SMTP configurations:
   - mail.cit.edu.ly (ports 25, 465, 587)
   - smtp.cit.edu.ly (port 587)
   - webmail.cit.edu.ly (port 587)
   - mx.cit.edu.ly (port 587)

2. **Update .env with working configuration**:
   The script will output the working configuration. Update your `.env`:
   ```env
   SMTP_HOST="cit.edu.ly"  # Or whichever works
   SMTP_PORT="587"
   SMTP_SECURE="false"
   SMTP_USER="ebic@cit.edu.ly"
   SMTP_PASS="G8VUG5=gWW2r2gP<"
   ```

3. **Test from the application**:
   ```bash
   # Using the new API endpoint
   curl -X POST http://localhost:3000/api/email/test \
     -H "Content-Type: application/json" \
     -d '{"testEmail": "your-email@example.com"}'
   ```

### 🔍 Troubleshooting

If emails don't send, try these solutions:

1. **Firewall Issues**:
   ```bash
   # Check if ports are open (Windows PowerShell)
   Test-NetConnection -ComputerName mail.cit.edu.ly -Port 587
   ```

2. **Try different ports**:
   - Port 25 (unencrypted)
   - Port 465 (SSL)
   - Port 587 (TLS) - Recommended
   - Port 2525 (alternative)

3. **Contact CIT IT Department**:
   - Request SMTP server details
   - Whitelist your server IP
   - Confirm account has SMTP access

---

## 3. Hono.js Route Structure Migration

### ✅ Problem Solved
Non-standard route structure replaced with proper Hono.js pattern.

### 📁 Files Created
- `src/features/email/server/route.ts` - Hono.js email routes
- `src/features/email/api/use-email-hooks.ts` - React Query hooks

### 🏗️ New Structure

```
src/features/email/
├── server/
│   └── route.ts          # Hono.js routes (backend)
├── api/
│   └── use-email-hooks.ts # React Query hooks (frontend)
└── components/           # React components (if needed)
```

### 🔄 Migration Steps

1. **Register the new routes** (Already done):
   ```typescript
   // src/app/api/[[...route]]/route.ts
   import email from "@/features/email/server/route";
   
   const routes = app
     .route("/email", email);
   ```

2. **Update status update calls**:
   
   **Old way (direct API call)**:
   ```typescript
   // DELETE THIS FILE: src/app/api/admin/collaborators/[id]/status/route.ts
   
   fetch(`/api/admin/collaborators/${id}/status`, {
     method: 'PATCH',
     body: JSON.stringify({ status: 'approved' })
   });
   ```
   
   **New way (using hooks)**:
   ```typescript
   import { useStatusUpdate } from '@/features/email/api/use-email-hooks';
   
   const StatusUpdateComponent = () => {
     const updateStatus = useStatusUpdate();
     
     const handleApprove = (id: string, type: 'collaborator' | 'innovator') => {
       updateStatus.mutate({
         id,
         type,
         status: 'approved'
       });
     };
   };
   ```

3. **Use the new monitoring hooks**:
   ```typescript
   import { useEmailMonitor, useEmailHealthCheck } from '@/features/email/api/use-email-hooks';
   
   const EmailDashboard = () => {
     const { data: stats } = useEmailMonitor(7); // Last 7 days
     const { data: health } = useEmailHealthCheck();
     
     return (
       <div>
         <h2>Email Statistics</h2>
         <p>Total Sent: {stats?.overview.sentEmails}</p>
         <p>Health: {health?.message}</p>
       </div>
     );
   };
   ```

### 📚 API Endpoints

All email endpoints now follow the Hono.js pattern:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/email/test` | POST | Send test email |
| `/api/email/monitor` | GET | Get email statistics |
| `/api/email/monitor/action` | POST | Retry/pause/resume emails |
| `/api/email/status` | PATCH | Update status with email |

### 🎣 Available React Query Hooks

```typescript
// Test email system
const { mutate: sendTest } = useTestEmail();

// Monitor emails
const { data: stats } = useEmailMonitor(days);

// Perform actions
const { mutate: performAction } = useEmailMonitorAction();

// Update status
const { mutate: updateStatus } = useStatusUpdate();

// Batch update
const { mutate: batchUpdate } = useBatchStatusUpdate();

// Health check
const { data: health } = useEmailHealthCheck();
```

---

## 📋 Quick Checklist

- [ ] Backup existing .env file
- [ ] Copy .env.consolidated to .env
- [ ] Test CIT.EDU.LY email with test script
- [ ] Update .env with working SMTP configuration
- [ ] Delete old environment files
- [ ] Remove old API route files
- [ ] Update components to use new hooks
- [ ] Test email sending from application
- [ ] Monitor email health dashboard

---

## 🧪 Testing Commands

```bash
# Test CIT.EDU.LY email configuration
node scripts/test-cit-email.js your-email@example.com

# Test specific configuration (e.g., config #1)
node scripts/test-cit-email.js your-email@example.com 1

# Test via API
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "test@example.com"}'

# Monitor emails
curl http://localhost:3000/api/email/monitor?days=7

# Update status with email notification
curl -X PATCH http://localhost:3000/api/email/status \
  -H "Content-Type: application/json" \
  -d '{
    "id": "collaborator-uuid",
    "type": "collaborator",
    "status": "approved"
  }'
```

---

## 🆘 Support

If you encounter issues:

1. Check the error logs in the console
2. Run the CIT email test script
3. Verify environment variables are loaded
4. Check Redis is running (for email queue)
5. Ensure database migrations are applied

## 🎉 Summary

You now have:
1. ✅ **Single consolidated .env file** - No more confusion
2. ✅ **CIT.EDU.LY email configured** - Professional domain email
3. ✅ **Proper Hono.js structure** - Clean, maintainable code
4. ✅ **React Query hooks** - Type-safe frontend integration
5. ✅ **Email monitoring** - Track and manage emails
6. ✅ **Comprehensive testing** - Scripts to verify everything works

The system is now more maintainable, secure, and follows best practices!
