# Email System Documentation

## Overview

The email system provides reliable, bilingual (Arabic/English) email delivery with automatic fallback to test mode when SMTP credentials are unavailable.

## Features

- ✅ **Dual Transport**: Automatically switches between SMTP and test mode
- ✅ **Bilingual Support**: Arabic (RTL) and English (LTR) templates
- ✅ **Email Logging**: All emails logged to database
- ✅ **Beautiful Templates**: Responsive HTML emails with branding
- ✅ **Error Handling**: Graceful degradation on SMTP failures
- ✅ **Type Safe**: Full TypeScript support

## Quick Start

### 1. Environment Setup

Update your `.env` file:

```bash
# CRITICAL: Use Google's SMTP server, NOT cit.edu.ly
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="ebic@cit.edu.ly"
SMTP_PASS="your-google-app-password"  # 16-character app password

EMAIL_FROM="ebic@cit.edu.ly"
```

### 2. Database Setup

Run the migration to ensure email tables exist:

```bash
# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate dev --name add_email_tables

# Or push schema directly (development only)
npx prisma db push
```

### 3. Test the System

```bash
# Run test script
npx tsx scripts/test-email-service.ts

# Run unit tests
npm test -- tests/email
```

## Usage

### Basic Email

```typescript
import { emailService } from '@/lib/email/service';

const result = await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>Hello World</p>',
  text: 'Hello World',
});

if (result.success) {
  console.log('Email sent:', result.messageId);
} else {
  console.error('Email failed:', result.error);
}
```

### Submission Confirmation

```typescript
await emailService.sendSubmissionConfirmation(
  'collaborator',  // or 'innovator'
  {
    id: collaborator.id,
    companyName: collaborator.companyName,
    email: collaborator.email,
  },
  'ar'  // or 'en'
);
```

### Status Update (Approval/Rejection)

```typescript
await emailService.sendStatusUpdate(
  'collaborator',
  {
    id: collaborator.id,
    companyName: collaborator.companyName,
    email: collaborator.email,
  },
  'approved',  // or 'rejected'
  {
    locale: 'en',
    reason: 'Optional reason for rejection',
    nextSteps: [
      'Step 1',
      'Step 2',
      'Step 3',
    ],
  }
);
```

## Transport Modes

### SMTP Transport (Production)

When `SMTP_PASS` is configured, emails are sent via Gmail SMTP.

**Requirements:**
- Valid Google App Password
- SMTP_HOST must be `smtp.gmail.com`
- Network access to port 587

### Test Transport (Development)

When SMTP credentials are missing, emails are written to JSON files.

**Output Location:** `tests/outgoing/email-{timestamp}.json`

**Benefits:**
- No network required
- View email HTML/content locally
- Test email logic without sending

## Email Templates

All templates include:
- Responsive design (mobile-friendly)
- Branding (EBIC logo colors)
- RTL/LTR support
- Professional styling
- Footer with contact info

### Submission Confirmation Template

**English:**
```
Subject: Collaboration Request Received / Innovation Request Received
Content: Acknowledgment, timeline, next steps
```

**Arabic:**
```
Subject: تم استلام طلب التعاون / تم استلام طلب الابتكار
Content: إقرار، جدول زمني، الخطوات القادمة
```

### Status Update Template

**Approval (Green):**
- Congratulatory message
- Next steps
- Contact information

**Rejection (Red):**
- Polite explanation
- Optional reason
- Future opportunities

## Database Logging

All emails are logged to the `EmailLog` table:

```prisma
model EmailLog {
  id           String      @id
  to           String
  from         String
  subject      String
  template     String
  status       EmailStatus
  messageId    String?
  errorMessage String?
  sentAt       DateTime?
  // ... more fields
}
```

**Query recent emails:**
```typescript
const recentEmails = await db.emailLog.findMany({
  where: {
    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  },
  orderBy: { createdAt: 'desc' },
  take: 10,
});
```

## Troubleshooting

### Error: "Invalid login: 535"

**Problem:** SMTP authentication failed

**Solutions:**
1. Generate new Google App Password
2. Ensure `SMTP_HOST="smtp.gmail.com"` (NOT `cit.edu.ly`)
3. Check password has no spaces: `qcgtmkaeytbyjzdz`

### Error: "Table emaillog does not exist"

**Problem:** Database migration not applied

**Solution:**
```bash
npx prisma migrate dev
# or
npx prisma db push
```

### Emails not sending

**Check:**
1. Test connection: `npx tsx scripts/test-email-service.ts`
2. View logs in console
3. Check `tests/outgoing/` for test mode files
4. Verify `.env` configuration

### Test mode activated automatically

**This is normal** when:
- SMTP_PASS is empty
- SMTP_HOST is incorrect
- Network issues prevent SMTP connection

**To force SMTP:** Ensure all credentials are correct in `.env`

## Production Checklist

- [ ] Generate Google App Password
- [ ] Update `.env` with correct SMTP settings
- [ ] Run `npx prisma migrate deploy`
- [ ] Test with `scripts/test-email-service.ts`
- [ ] Verify emails arrive in inbox
- [ ] Check spam folder if not received
- [ ] Monitor `EmailLog` table for errors

## API Reference

### emailService.sendEmail(options)

Send a custom email.

**Parameters:**
- `to: string` - Recipient email
- `subject: string` - Email subject
- `html?: string` - HTML content
- `text?: string` - Plain text content
- `from?: string` - Sender (defaults to EMAIL_FROM)
- `locale?: 'ar' | 'en'` - Language preference

**Returns:** `Promise<SendResult>`

### emailService.sendSubmissionConfirmation(type, data, locale)

Send submission confirmation email.

**Parameters:**
- `type: 'collaborator' | 'innovator'`
- `data: { id, companyName?, name?, email }`
- `locale: 'ar' | 'en'`

**Returns:** `Promise<SendResult>`

### emailService.sendStatusUpdate(type, data, status, options)

Send status update email (approval/rejection).

**Parameters:**
- `type: 'collaborator' | 'innovator'`
- `data: { id, companyName?, name?, email }`
- `status: 'approved' | 'rejected'`
- `options?: { reason?, nextSteps?, locale? }`

**Returns:** `Promise<SendResult>`

### emailService.testConnection()

Test SMTP connection.

**Returns:** `Promise<{ success: boolean, provider?: string, error?: string }>`

## File Structure

```
src/lib/email/
├── service.ts              # Main email service
├── transports/
│   ├── nodemailer.ts      # SMTP transport
│   └── test.ts            # File-based test transport
tests/
├── email/
│   └── email-service.test.ts  # Unit tests
└── outgoing/              # Test email output
scripts/
└── test-email-service.ts  # Manual test script
```

## Support

For issues or questions:
- Check logs: `console.log` output
- View test emails: `tests/outgoing/*.json`
- Database logs: `EmailLog` table
- Email: ebic@cit.edu.ly
