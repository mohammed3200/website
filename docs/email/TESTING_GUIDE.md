# Email System Testing Guide

**Status**: ✅ Complete  
**Date**: November 7, 2025  
**Templates**: 6 templates fully implemented

---

## 📧 Available Email Templates

### 1. Submission Confirmation
**Files**: `SubmissionConfirmation.tsx`  
**Purpose**: Confirm registration for collaborators and innovators  
**Languages**: Arabic, English  
**Features**:
- Success confirmation box
- Reference ID display
- Timeline expectations
- Next steps list

### 2. Status Update
**Files**: `StatusUpdate.tsx`  
**Purpose**: Notify approval or rejection  
**Languages**: Arabic, English  
**Features**:
- Visual status indicator (✅/❌)
- Optional rejection reason
- Next steps for approved users
- Encouraging message for rejected

### 3. Password Reset
**Files**: `PasswordReset.tsx`  
**Purpose**: Send password reset link  
**Languages**: Arabic, English  
**Features**:
- Time-limited reset link
- Security warnings
- Alternative link display
- Copy-paste option

### 4. Welcome Email
**Files**: `Welcome.tsx`  
**Purpose**: Welcome new users  
**Languages**: Arabic, English  
**Features**:
- Role display
- Feature highlights
- Login button
- Support information

### 5. Two-Factor Auth
**Files**: `TwoFactorAuth.tsx`  
**Purpose**: Send 2FA verification code  
**Languages**: Arabic, English  
**Features**:
- Large code display
- Step-by-step instructions
- Expiry warning
- Security alert

### 6. Base Layout
**Files**: `BaseLayout.tsx`  
**Purpose**: Shared layout for all emails  
**Features**:
- EBIC branding
- Logo header
- Contact footer
- RTL/LTR support

---

## 🧪 Testing Methods

### Method 1: Preview with React Email (No Sending)

**Best for**: Quick visual testing, design iteration

```bash
# Start React Email dev server
pnpm email dev

# Or with npm
npm run email dev
```

This opens a browser at `http://localhost:3000` where you can:
- Preview all templates
- Switch between languages
- Test responsive design
- No email credentials needed

### Method 2: Test Script (Real Emails)

**Best for**: End-to-end testing, SMTP validation

```bash
# Set your test email
$env:TEST_EMAIL="your-email@gmail.com"

# Run test script
npx tsx scripts/test-email-templates.ts
```

**What it tests**:
1. ✅ Submission Confirmation (Arabic - Collaborator)
2. ✅ Submission Confirmation (English - Innovator)
3. ✅ Status Update - Approval (Arabic)
4. ✅ Status Update - Rejection (English)
5. ✅ Password Reset (Arabic)
6. ✅ Welcome Email (English)
7. ✅ 2FA Code (Arabic)
8. ✅ SMTP Connection

### Method 3: Manual Testing

**Best for**: Testing specific scenarios

```typescript
import { emailService } from '@/lib/email/service';

// Test submission confirmation
await emailService.sendSubmissionConfirmation(
  'collaborator',
  {
    id: 'CLB-001',
    companyName: 'شركة التقنية',
    email: 'test@example.com',
  },
  'ar'
);

// Test approval
await emailService.sendStatusUpdate(
  'innovator',
  {
    id: 'INV-001',
    name: 'Ahmed',
    email: 'test@example.com',
  },
  'approved',
  {
    locale: 'en',
    nextSteps: ['Step 1', 'Step 2'],
  }
);

// Test password reset
await emailService.sendPasswordReset(
  {
    name: 'محمد',
    email: 'test@example.com',
    resetLink: 'https://example.com/reset?token=abc',
  },
  'ar'
);

// Test welcome
await emailService.sendWelcome(
  {
    name: 'Ahmed',
    email: 'test@example.com',
    role: 'Admin',
    loginLink: 'https://example.com/login',
  },
  'en'
);

// Test 2FA
await emailService.send2FA(
  {
    name: 'Ahmed',
    email: 'test@example.com',
    code: '123456',
  },
  'ar'
);
```

---

## ⚙️ Setup Requirements

### 1. Environment Variables

Create or update `.env`:

```env
# SMTP Configuration (Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="ebic@cit.edu.ly"
SMTP_PASS="your-google-app-password"

# Email From
EMAIL_FROM="ebic@cit.edu.ly"

# Optional: Test email
TEST_EMAIL="your-test-email@gmail.com"

# App URL (for links in emails)
NEXT_PUBLIC_APP_URL="https://ebic.cit.edu.ly"
```

### 2. Google App Password

**Required for Gmail SMTP**

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Create new app password for "Mail"
5. Copy 16-character code
6. Set as `SMTP_PASS` in `.env`

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations (if needed)
npx prisma migrate dev
```

---

## 🧪 Test Scenarios

### Scenario 1: New Collaborator Registration

**Flow**:
1. User submits collaborator form
2. System saves to database
3. **Email sent**: Submission confirmation (Arabic/English)
4. Admin reviews and approves
5. **Email sent**: Approval notification

**Test Commands**:
```bash
# Test confirmation
npx tsx -e "import {emailService} from '@/lib/email/service'; emailService.sendSubmissionConfirmation('collaborator', {id:'CLB-001', companyName:'Test Co', email:'test@example.com'}, 'ar').then(r => console.log(r))"

# Test approval
npx tsx -e "import {emailService} from '@/lib/email/service'; emailService.sendStatusUpdate('collaborator', {id:'CLB-001', companyName:'Test Co', email:'test@example.com'}, 'approved', {locale:'ar'}).then(r => console.log(r))"
```

### Scenario 2: Innovator Rejected

**Flow**:
1. Innovator submits project
2. **Email sent**: Confirmation
3. Admin rejects with reason
4. **Email sent**: Rejection with feedback

### Scenario 3: Password Reset

**Flow**:
1. User requests password reset
2. System generates token
3. **Email sent**: Reset link with expiry warning
4. User clicks link and resets password

### Scenario 4: New Admin User

**Flow**:
1. Admin creates new user
2. **Email sent**: Welcome email with login link
3. User logs in first time
4. **Email sent**: 2FA code for verification

---

## ✅ Testing Checklist

### Visual Testing
- [ ] Templates render correctly in React Email preview
- [ ] Arabic text displays properly (RTL)
- [ ] English text displays properly (LTR)
- [ ] Logo images load correctly
- [ ] Colors match branding (orange gradient)
- [ ] Buttons are styled and clickable
- [ ] Mobile responsive design works
- [ ] Footer displays correctly

### Email Client Testing
- [ ] Gmail (web)
- [ ] Gmail (mobile app)
- [ ] Outlook (web)
- [ ] Outlook (desktop client)
- [ ] Apple Mail
- [ ] Yahoo Mail
- [ ] Thunderbird

### Content Testing
- [ ] All dynamic variables render
- [ ] Arabic translations are correct
- [ ] English text is professional
- [ ] Links work correctly
- [ ] No broken images
- [ ] Personalization works (names, IDs, etc.)

### Functionality Testing
- [ ] SMTP connection successful
- [ ] Emails send without errors
- [ ] Database logging works
- [ ] Both languages work
- [ ] All template types tested
- [ ] Error handling works

### Deliverability Testing
- [ ] Emails arrive in inbox (not spam)
- [ ] Subject lines are clear
- [ ] Preview text is correct
- [ ] Unsubscribe link works (if applicable)
- [ ] SPF/DKIM configured
- [ ] Mail-tester score > 8/10

---

## 🐛 Troubleshooting

### Issue: "Email transport not initialized"

**Solution**:
```bash
# Check .env file
cat .env | grep SMTP

# Ensure all SMTP variables are set
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
```

### Issue: "Invalid login: 535"

**Problem**: Wrong SMTP credentials

**Solution**:
1. Generate new Google App Password
2. Update `SMTP_PASS` in `.env`
3. Restart dev server

### Issue: "Module not found: @react-email/components"

**Solution**:
```bash
pnpm install @react-email/components
# or
npm install @react-email/components
```

### Issue: Templates not rendering

**Solution**:
```bash
# Check if templates exist
ls src/lib/email/templates/

# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Arabic text shows as boxes/question marks

**Solution**:
- Check email client supports UTF-8
- Verify HTML has charset meta tag
- Test in different email client

### Issue: "Connection timeout"

**Solution**:
1. Check firewall allows port 587
2. Verify SMTP_HOST is correct
3. Test with mail-tester.com
4. Check Gmail security settings

---

## 📊 Expected Results

### All Tests Pass
```
🧪 Testing Email Templates...

1️⃣ Testing Submission Confirmation (Arabic - Collaborator)...
✅ Success: <message-id>

2️⃣ Testing Submission Confirmation (English - Innovator)...
✅ Success: <message-id>

...

📊 Test Summary:
✅ Passed: 7/7
❌ Failed: 0/7

🎉 All email templates are working correctly!
```

### Email Received
Check inbox for:
- ✅ Professional EBIC branding
- ✅ Correct language (Arabic/English)
- ✅ All dynamic content rendered
- ✅ Working links and buttons
- ✅ Not in spam folder

---

## 🎯 Performance Benchmarks

### Email Sending Speed
- **Target**: < 2 seconds per email
- **Typical**: 0.5-1.5 seconds with Gmail SMTP

### Template Rendering
- **Target**: < 100ms per template
- **Typical**: 20-50ms with React Email

### SMTP Connection
- **Target**: < 1 second
- **Typical**: 200-500ms

---

## 📝 Test Report Template

```markdown
## Email Test Report

**Date**: YYYY-MM-DD  
**Tester**: Name  
**Environment**: Development/Staging/Production

### Test Results

| Template | Language | Status | Notes |
|----------|----------|--------|-------|
| Submission Confirmation | AR | ✅ Pass | |
| Submission Confirmation | EN | ✅ Pass | |
| Status Update (Approved) | AR | ✅ Pass | |
| Status Update (Rejected) | EN | ✅ Pass | |
| Password Reset | AR | ✅ Pass | |
| Welcome Email | EN | ✅ Pass | |
| 2FA Code | AR | ✅ Pass | |

### Email Client Tests

| Client | Rendering | Links | Images | RTL |
|--------|-----------|-------|--------|-----|
| Gmail Web | ✅ | ✅ | ✅ | ✅ |
| Gmail Mobile | ✅ | ✅ | ✅ | ✅ |
| Outlook Web | ✅ | ✅ | ✅ | ✅ |
| Apple Mail | ✅ | ✅ | ✅ | ✅ |

### Issues Found
None / [List any issues]

### Recommendations
[Any suggestions for improvement]
```

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] All templates tested and working
- [ ] SMTP credentials verified
- [ ] Database logging confirmed
- [ ] Both languages tested
- [ ] Email deliverability checked
- [ ] Spam score tested (> 8/10)
- [ ] Error handling tested
- [ ] Fallback methods work
- [ ] SPF/DKIM configured
- [ ] Rate limiting understood
- [ ] Monitoring set up
- [ ] Documentation complete

---

## 📚 Additional Resources

- **React Email Docs**: https://react.email
- **Nodemailer Docs**: https://nodemailer.com
- **Gmail SMTP Guide**: https://support.google.com/mail/answer/7126229
- **Mail Tester**: https://www.mail-tester.com
- **Email Client Support**: https://www.caniemail.com

---

**Last Updated**: November 7, 2025  
**Status**: ✅ All tests passing  
**Next**: Integration with registration workflows
