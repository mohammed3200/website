# Email Integration Plan - Sprint-1

## Design Overview

This plan implements a production-grade email system using nodemailer + BullMQ queue + JSON-RPC dispatcher for the Misurata Entrepreneurship Center platform. The system supports:

1. **Action Emails:** Approval/rejection notifications with tokenized action links
2. **2FA Tokens:** Time-limited, single-use tokens for admin authentication
3. **Queue Management:** Redis-backed BullMQ for reliable delivery
4. **Dual Transport:** Gmail SMTP (production) + File transport (development)
5. **Bilingual Templates:** Arabic/English React Email templates

---

## Data Flow Diagram (Text-Based)

```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT REQUEST                                                  │
│  POST /api/rpc { method: "email.sendActionEmail", params: {...}}│
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  RPC DISPATCHER (src/app/api/rpc/route.ts)                      │
│  - Validates JSON-RPC 2.0 format                                │
│  - Parses method name: "email.sendActionEmail"                  │
│  - Looks up handler in registry                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  RPC HANDLER (src/lib/email/rpc/sendActionEmail.ts)            │
│  - Validates params with Zod schema                             │
│  - Generates HMAC-signed token (token.ts)                       │
│  - Hashes token with SHA-256 for DB storage                     │
│  - Renders React Email template (action-email.ar.tsx)          │
│  - Adds to EmailQueue + EmailAction tables (Prisma)            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  DATABASE (MySQL via Prisma)                                    │
│  - EmailQueue: { to, subject, body, status: PENDING }          │
│  - EmailAction: { tokenHash, expiresAt, used: false }          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  BULLMQ QUEUE (Redis)                                           │
│  - Worker polls every 5 seconds                                 │
│  - Fetches PENDING jobs from EmailQueue                        │
│  - Locks row to prevent double-send                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  EMAIL WORKER (services/email-worker/worker.ts)                │
│  - Selects transport (nodemailer or test)                       │
│  - Sends email via service.send(options)                        │
│  - Updates EmailQueue.status = COMPLETED                        │
│  - Logs to EmailLog table                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌───────────────────┴────────────────────┐
        │                                        │
┌───────▼─────────┐                  ┌───────────▼──────────┐
│  SMTP TRANSPORT │                  │  TEST TRANSPORT      │
│  (Production)   │                  │  (Development)       │
│  - Gmail SMTP   │                  │  - Writes JSON file  │
│  - Returns      │                  │  - Path:             │
│    messageId    │                  │    tests/outgoing/   │
└─────────────────┘                  └──────────────────────┘
```

---

## Exact Files to Create/Modify

### 🆕 New Files (18 files)

#### 1. RPC Infrastructure
- **`src/app/api/rpc/route.ts`** - JSON-RPC dispatcher endpoint
- **`src/lib/email/rpc/registry.ts`** - RPC method registry
- **`src/lib/email/rpc/sendActionEmail.ts`** - Handler for action emails
- **`src/lib/email/rpc/send2FA.ts`** - Handler for 2FA tokens

#### 2. Email Service Layer
- **`src/lib/email/service.ts`** - Transport-agnostic email service
- **`src/lib/email/transports/nodemailer.ts`** - Gmail SMTP adapter
- **`src/lib/email/transports/test.ts`** - File-based test transport
- **`src/lib/email/queue.ts`** - BullMQ queue helpers

#### 3. Token Utilities
- **`src/lib/email/utils/token.ts`** - HMAC token signing/verification
- **`src/lib/email/utils/hash.ts`** - SHA-256 hashing for storage

#### 4. Templates (React Email)
- **`src/lib/email/templates/action-email.en.tsx`** - English template
- **`src/lib/email/templates/action-email.ar.tsx`** - Arabic template
- **`src/lib/email/templates/2fa-email.en.tsx`** - 2FA English
- **`src/lib/email/templates/2fa-email.ar.tsx`** - 2FA Arabic

#### 5. Worker Process
- **`services/email-worker/worker.ts`** - BullMQ worker process
- **`services/email-worker/config.ts`** - Worker configuration

#### 6. Tests
- **`tests/email/rpc.dispatcher.test.ts`** - RPC dispatcher tests
- **`tests/email/token.test.ts`** - Token signing tests
- **`tests/email/sendActionEmail.test.ts`** - Handler tests

#### 7. Documentation
- **`docs/email/README.md`** - Setup and usage guide

---

### ✏️ Files to Modify (6 files)

#### 1. **`prisma/schema.prisma`**
**Change:** Add `EmailAction` model
```prisma
model EmailAction {
  id             String   @id @default(cuid())
  emailQueueId   String
  emailQueue     EmailQueue @relation(fields: [emailQueueId], references: [id], onDelete: Cascade)
  tokenHash      String   @unique
  actionTypes    Json     // ["approve", "reject", "confirm"]
  used           Boolean  @default(false)
  usedAt         DateTime?
  expiresAt      DateTime
  data           Json?    // Additional context
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([tokenHash])
  @@index([used])
  @@index([expiresAt])
}

// Add relation to EmailQueue
model EmailQueue {
  // ... existing fields
  emailActions EmailAction[]
}
```
**Migration:** `npx prisma migrate dev --name add_email_action`

#### 2. **`src/app/api/[[...route]]/route.ts`**
**Change:** Mount RPC router
```typescript
import rpcRouter from "@/app/api/rpc/route";

const routes = app
  .route("/collaborator", collaborator)
  .route("/innovators", innovators)
  .route("/rpc", rpcRouter); // Add this line
```

#### 3. **`package.json`**
**Change:** Add worker script
```json
"scripts": {
  "worker:email": "tsx services/email-worker/worker.ts",
  "test:email": "jest tests/email --watch"
}
```

#### 4. **`.env`** (Already has most vars, add these)
```env
# Email Token Security (REQUIRED - Generate with: openssl rand -hex 32)
EMAIL_TOKEN_SECRET="generate-this-with-openssl-rand-hex-32"
EMAIL_TOKEN_TTL="3600"  # 1 hour in seconds

# Worker Configuration
EMAIL_QUEUE_CONCURRENCY="5"
EMAIL_WORKER_POLL_INTERVAL="5000"  # 5 seconds
```

#### 5. **`.gitignore`**
**Change:** Ignore test email outputs
```
# Email test files
tests/outgoing/*.json
!tests/outgoing/.gitkeep
```

#### 6. **`README.md`**
**Change:** Add email system section
```markdown
## Email System

### Running the Email Worker
```bash
npm run worker:email
```

### Testing Email Delivery
```bash
curl -X POST http://localhost:3000/api/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "email.sendActionEmail",
    "params": {
      "to": "test@example.com",
      "templateId": "action-email",
      "locale": "en"
    },
    "id": "1"
  }'
```
```

---

## Database Adapter Choice: Prisma (Confirmed)

**Decision:** Use Prisma ORM
**Rationale:**
1. ✅ Already integrated (`@prisma/client@6.11.1`)
2. ✅ Existing models: `EmailQueue`, `EmailLog`, `EmailTemplate`
3. ✅ MySQL database configured
4. ✅ Type-safe queries
5. ✅ Migration system in place

**Suggested Prisma Model Patches:**
See "Files to Modify #1" above for `EmailAction` model.

---

## Environment Variables Required

### Critical (Must Generate)
```bash
# Generate secure secret:
openssl rand -hex 32

# Add to .env:
EMAIL_TOKEN_SECRET="<generated-secret>"
EMAIL_TOKEN_TTL="3600"
```

### Already Present (Verify)
```bash
✅ SMTP_HOST="smtp.gmail.com"
✅ SMTP_PORT="587"
✅ SMTP_USER="ebic@cit.edu.ly"
✅ SMTP_PASS="<Google App Password>"  # Must be valid App Password
✅ EMAIL_FROM="ebic@cit.edu.ly"
✅ REDIS_HOST="localhost"
✅ REDIS_PORT="6379"
✅ DATABASE_URL="mysql://..."
```

---

## Local Test Strategy

### 1. Test Transport (No Network)
**Mechanism:** File-based transport writes JSON to `tests/outgoing/`
**Usage:**
```typescript
// Automatically used when SMTP_PASS is empty
if (!process.env.SMTP_PASS) {
  transport = createTestTransport();
}
```

**Output Format:**
```json
// tests/outgoing/email-1704123456789.json
{
  "to": "test@example.com",
  "subject": "Your submission was approved",
  "body": "<html>...</html>",
  "timestamp": "2024-01-01T12:34:56.789Z",
  "messageId": "test-abc123"
}
```

### 2. Nodemailer Test Account (Optional)
```typescript
// Alternative: Use Ethereal Email for testing
const testAccount = await nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass
  }
});
```

### 3. Assertion Strategy
```typescript
// tests/email/sendActionEmail.test.ts
it('should queue email with valid token', async () => {
  const response = await rpcCall('email.sendActionEmail', params);
  
  // Assert RPC response
  expect(response.result.status).toBe('queued');
  
  // Assert database records
  const queueRecord = await db.emailQueue.findUnique({
    where: { id: response.result.emailQueueId }
  });
  expect(queueRecord.status).toBe('PENDING');
  
  const actionRecord = await db.emailAction.findFirst({
    where: { emailQueueId: queueRecord.id }
  });
  expect(actionRecord.used).toBe(false);
  expect(actionRecord.expiresAt).toBeAfter(new Date());
  
  // Assert test file created (if using test transport)
  if (process.env.NODE_ENV === 'test') {
    const files = fs.readdirSync('tests/outgoing/');
    expect(files.length).toBeGreaterThan(0);
  }
});
```

---

## Sprint Plan with Tasks

### Sprint-1 Duration: 8-12 hours

#### Phase 1: Foundation (2-3 hours)
**Tasks:**
1. ✅ Add `EmailAction` model to Prisma schema
2. ✅ Run migration: `npx prisma migrate dev`
3. ✅ Generate `EMAIL_TOKEN_SECRET` and add to `.env`
4. ✅ Create directory structure: `src/lib/email/`, `tests/email/`

**Acceptance Criteria:**
- [ ] Prisma migration applied successfully
- [ ] `EmailAction` table exists in MySQL
- [ ] `.env` has `EMAIL_TOKEN_SECRET`
- [ ] Folders created with `.gitkeep` files

---

#### Phase 2: Token Utilities (1-2 hours)
**Tasks:**
1. ✅ Implement `src/lib/email/utils/token.ts`
   - `signToken(payload, { ttl })` - HMAC-SHA256 signing
   - `verifyToken(token)` - Validates signature + expiry
   - `hashToken(token)` - SHA-256 for storage
2. ✅ Write unit tests: `tests/email/token.test.ts`

**Acceptance Criteria:**
- [ ] Token signing produces compact string (JWT-like)
- [ ] Verification detects tampering (invalid signature)
- [ ] Verification detects expiry (TTL exceeded)
- [ ] Hash function is deterministic
- [ ] All token tests pass

---

#### Phase 3: RPC Infrastructure (2-3 hours)
**Tasks:**
1. ✅ Create `src/app/api/rpc/route.ts` (JSON-RPC dispatcher)
2. ✅ Create `src/lib/email/rpc/registry.ts` (method registry)
3. ✅ Create `src/lib/email/rpc/sendActionEmail.ts` (handler)
4. ✅ Mount RPC router in `src/app/api/[[...route]]/route.ts`
5. ✅ Write tests: `tests/email/rpc.dispatcher.test.ts`

**Acceptance Criteria:**
- [ ] `POST /api/rpc` accepts JSON-RPC 2.0 format
- [ ] Invalid method returns error code `-32601`
- [ ] Handler validates params with Zod
- [ ] Handler creates `EmailQueue` + `EmailAction` records
- [ ] Returns `{ jsonrpc: "2.0", result: { status: "queued" }, id: "1" }`
- [ ] RPC dispatcher tests pass

---

#### Phase 4: Email Service + Transports (2-3 hours)
**Tasks:**
1. ✅ Create `src/lib/email/service.ts` (pluggable adapter)
2. ✅ Create `src/lib/email/transports/nodemailer.ts` (Gmail SMTP)
3. ✅ Create `src/lib/email/transports/test.ts` (file transport)
4. ✅ Implement transport selection logic
5. ✅ Add health check: `testConnection()` method
6. ✅ Write tests: `tests/email/nodemailer.transport.test.ts`

**Acceptance Criteria:**
- [ ] Service selects nodemailer if `SMTP_PASS` present
- [ ] Service selects test transport if no SMTP credentials
- [ ] Test transport writes JSON to `tests/outgoing/`
- [ ] Nodemailer transport returns messageId
- [ ] Health check validates SMTP connection
- [ ] Transport tests pass

---

#### Phase 5: Templates (React Email) (1-2 hours)
**Tasks:**
1. ✅ Create `src/lib/email/templates/action-email.en.tsx`
2. ✅ Create `src/lib/email/templates/action-email.ar.tsx`
3. ✅ Implement token link generation
4. ✅ Test rendering with: `npm run email dev`

**Acceptance Criteria:**
- [ ] Templates render HTML with embedded styles
- [ ] Action links include signed token: `?token=xxx`
- [ ] Arabic template has RTL layout
- [ ] English template has LTR layout
- [ ] Templates accept locale prop

---

#### Phase 6: BullMQ Queue + Worker (2-3 hours)
**Tasks:**
1. ✅ Create `src/lib/email/queue.ts` (BullMQ helpers)
2. ✅ Create `services/email-worker/worker.ts`
3. ✅ Implement queue processing logic
4. ✅ Add row locking (Prisma transaction)
5. ✅ Add retry logic (3 attempts with exponential backoff)
6. ✅ Add script to `package.json`: `worker:email`

**Acceptance Criteria:**
- [ ] Worker polls `EmailQueue` every 5 seconds
- [ ] Worker processes PENDING jobs
- [ ] Worker updates status to COMPLETED/FAILED
- [ ] Worker logs to `EmailLog` table
- [ ] Worker respects concurrency limit (5)
- [ ] `npm run worker:email` starts worker successfully

---

#### Phase 7: Integration Tests (1-2 hours)
**Tasks:**
1. ✅ Write `tests/email/sendActionEmail.test.ts`
2. ✅ Add smoke test: RPC → Queue → Transport
3. ✅ Test token verification flow
4. ✅ Test template rendering
5. ✅ Add CI job to `.github/workflows/test.yml`

**Acceptance Criteria:**
- [ ] POST RPC call returns `200` with queued status
- [ ] Database record exists in `EmailQueue`
- [ ] Database record exists in `EmailAction`
- [ ] Worker processes job (mock or test transport)
- [ ] Token can be verified
- [ ] All integration tests pass
- [ ] CI job runs tests on PR

---

## Time Estimates Summary

| Phase | Task | Estimated Time |
|-------|------|---------------|
| 1 | Foundation | 2-3 hours |
| 2 | Token Utils | 1-2 hours |
| 3 | RPC Infrastructure | 2-3 hours |
| 4 | Service + Transports | 2-3 hours |
| 5 | Templates | 1-2 hours |
| 6 | Queue + Worker | 2-3 hours |
| 7 | Integration Tests | 1-2 hours |
| **Total** | **Sprint-1** | **11-19 hours** |

---

## Security Considerations

### Token Security
1. **HMAC Signing:** Tokens use HMAC-SHA256 with `EMAIL_TOKEN_SECRET`
2. **Hash Storage:** Only SHA-256 hash stored in DB, never raw token
3. **Single Use:** `EmailAction.used` flag prevents replay attacks
4. **Expiry:** Tokens expire after `EMAIL_TOKEN_TTL` seconds
5. **Secret Rotation:** Support for key rotation without breaking existing tokens

### Email Security
1. **Rate Limiting:** Enforce provider limits (Gmail: 500/day)
2. **Input Validation:** Zod schemas for all RPC params
3. **SQL Injection:** Prisma parameterized queries
4. **XSS Prevention:** React Email auto-escapes HTML
5. **PII Masking:** Log emails as `t***@example.com` in production

### Operational Security
1. **Queue Locking:** Prisma transactions prevent double-send
2. **Error Handling:** Sensitive SMTP errors not exposed to client
3. **Retry Limits:** Max 3 attempts to prevent infinite loops
4. **Dead Letter Queue:** Failed jobs moved to `EmailLog` with error

---

## Dependencies Status

### ✅ Already Installed (No Action Required)
```json
{
  "nodemailer": "^7.0.5",           // SMTP client
  "bullmq": "^5.58.0",              // Queue management
  "ioredis": "^5.7.0",              // Redis client
  "react-email": "^4.2.8",          // Template engine
  "@react-email/components": "^0.5.0", // Email UI components
  "jsonwebtoken": "^9.0.2",         // For HMAC signing
  "uuid": "^11.1.0",                // UUID generation
  "zod": "^4.0.3",                  // Schema validation
  "hono": "^4.8.3"                  // API framework
}
```

### DevDependencies (Already Present)
```json
{
  "jest": "^29.7.0",
  "@testing-library/react": "^16.3.0",
  "ts-jest": "29.1.0"
}
```

---

## Redis Configuration

### Required for BullMQ Queue
```bash
# Install Redis (if not installed)
# macOS:
brew install redis
brew services start redis

# Ubuntu/Debian:
sudo apt-get install redis-server
sudo systemctl start redis

# Windows (via WSL):
sudo apt-get install redis-server
sudo service redis-server start

# Verify Redis is running:
redis-cli ping  # Should return "PONG"
```

### .env Configuration
```env
REDIS_HOST="localhost"
REDIS_PORT="6379"
# REDIS_PASSWORD=""  # Leave empty for local development
```

---

## Testing Commands

### Unit Tests
```bash
# Test token utilities
npm run test:email -- token.test.ts

# Test RPC dispatcher
npm run test:email -- rpc.dispatcher.test.ts

# Test handler
npm run test:email -- sendActionEmail.test.ts

# Run all email tests
npm run test:email
```

### Integration Tests
```bash
# Start dependencies
npm run dev           # Terminal 1 (Next.js server)
npm run worker:email  # Terminal 2 (Email worker)
redis-server          # Terminal 3 (Redis)

# Test RPC endpoint
curl -X POST http://localhost:3000/api/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "email.sendActionEmail",
    "params": {
      "to": "test@example.com",
      "templateId": "action-email",
      "locale": "en",
      "data": {
        "name": "John Doe",
        "actionType": "approve",
        "itemTitle": "Test Submission"
      }
    },
    "id": "1"
  }'

# Check test output (if using test transport)
ls -la tests/outgoing/
cat tests/outgoing/email-*.json

# Check database
npx prisma studio  # Open Prisma Studio GUI
# Navigate to EmailQueue and EmailAction tables
```

### Manual Email Test
```bash
# Send test email via existing endpoint
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "your-email@example.com"}'
```

---

## CI/CD Integration

### GitHub Actions Workflow
**File:** `.github/workflows/email-tests.yml`
```yaml
name: Email System Tests

on:
  pull_request:
    paths:
      - 'src/lib/email/**'
      - 'src/app/api/rpc/**'
      - 'services/email-worker/**'
      - 'tests/email/**'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
      
      mysql:
        image: mysql:8
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: citcoder_eitdc_test
        ports:
          - 3306:3306
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Generate Prisma Client
        run: npx prisma generate
      
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: mysql://root:root@localhost:3306/citcoder_eitdc_test
      
      - name: Run email tests
        run: npm run test:email
        env:
          EMAIL_TOKEN_SECRET: test-secret-key-for-ci-only
          EMAIL_TOKEN_TTL: "3600"
          REDIS_HOST: localhost
          REDIS_PORT: "6379"
          NODE_ENV: test
      
      - name: Upload test artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-outputs
          path: tests/outgoing/
```

---

## Documentation Structure

### docs/email/README.md
```markdown
# Email System Documentation

## Quick Start

### 1. Environment Setup
```bash
# Generate token secret
openssl rand -hex 32

# Add to .env
EMAIL_TOKEN_SECRET="<generated-secret>"
EMAIL_TOKEN_TTL="3600"
```

### 2. Start Services
```bash
# Terminal 1: Redis
redis-server

# Terminal 2: Next.js
npm run dev

# Terminal 3: Email Worker
npm run worker:email
```

### 3. Send Test Email
```bash
curl -X POST http://localhost:3000/api/rpc \
  -H "Content-Type: application/json" \
  -d @tests/fixtures/sample-rpc-request.json
```

## Architecture

[Diagram from email-integration-plan.md]

## API Reference

### RPC Methods

#### email.sendActionEmail
Sends an action email with tokenized links.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "email.sendActionEmail",
  "params": {
    "to": "user@example.com",
    "templateId": "action-email",
    "locale": "en",
    "data": {
      "name": "John Doe",
      "actionType": "approve",
      "itemTitle": "Project Submission"
    }
  },
  "id": "1"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "queued",
    "emailQueueId": "clx123456789",
    "estimatedSendTime": "2024-01-01T12:35:00Z"
  },
  "id": "1"
}
```

## Troubleshooting

### Email Not Sending
1. Check SMTP credentials in `.env`
2. Verify Google App Password is correct
3. Check Redis connection: `redis-cli ping`
4. Check worker logs: `npm run worker:email`
5. Check EmailQueue table for errors

### Token Verification Fails
1. Verify `EMAIL_TOKEN_SECRET` matches across environments
2. Check token expiry: tokens expire after `EMAIL_TOKEN_TTL` seconds
3. Ensure token hasn't been used: `EmailAction.used = false`

### Worker Not Processing Queue
1. Check Redis connection
2. Verify Prisma connection: `npx prisma studio`
3. Check worker logs for errors
4. Verify `EmailQueue` has PENDING records

## Production Deployment

### Required Environment Variables
```env
EMAIL_TOKEN_SECRET="<rotate-this-secret>"
EMAIL_TOKEN_TTL="3600"
SMTP_PASS="<google-app-password>"
REDIS_HOST="<production-redis-host>"
REDIS_PORT="6379"
REDIS_PASSWORD="<redis-password>"
```

### Monitoring
- Email success rate: Check `EmailLog` table
- Queue health: Monitor `EmailQueue.status` distribution
- Worker performance: Track average processing time
- Provider limits: Monitor daily/hourly send counts

## FAQ

**Q: Can I use a different email provider?**
A: Yes, modify `src/lib/email/transports/nodemailer.ts` to use different SMTP settings.

**Q: How do I test without sending real emails?**
A: Remove `SMTP_PASS` from `.env` to use test transport (writes JSON files).

**Q: What happens if Redis goes down?**
A: Queue processing stops, but RPC calls still create database records. When Redis reconnects, worker resumes processing.
```

---

## Success Criteria Summary

### Sprint-1 is complete when:

1. ✅ **RPC Endpoint Works**
   - POST `/api/rpc` returns JSON-RPC 2.0 responses
   - Method `email.sendActionEmail` queues emails successfully

2. ✅ **Database Records Created**
   - `EmailQueue` record with status PENDING
   - `EmailAction` record with hashed token

3. ✅ **Worker Processes Queue**
   - Worker polls queue every 5 seconds
   - Updates status to COMPLETED after sending
   - Logs to `EmailLog` table

4. ✅ **Transport Selection**
   - Uses Gmail SMTP if credentials present
   - Falls back to test transport otherwise
   - Test transport creates JSON files

5. ✅ **Token Security**
   - Tokens are HMAC-signed
   - Only hashes stored in database
   - Verification detects tampering and expiry

6. ✅ **Templates Render**
   - React Email templates produce HTML
   - Action links include signed tokens
   - Arabic and English versions work

7. ✅ **Tests Pass**
   - Unit tests: 100% coverage for token utils
   - Integration test: Full RPC → Queue → Send flow
   - `npm test` passes on CI

8. ✅ **Documentation Complete**
   - `docs/email/README.md` with setup instructions
   - `README.md` updated with email system section
   - Environment variables documented

---

## Next Steps (Future Sprints)

### Sprint-2: Production Hardening
- [ ] Implement SPF/DKIM signing
- [ ] Add Gmail OAuth2 support
- [ ] Webhook endpoints for delivery tracking
- [ ] Admin UI for email monitoring
- [ ] Advanced retry logic with exponential backoff
- [ ] Dead letter queue management

### Sprint-3: Advanced Features
- [ ] Email templates WYSIWYG editor
- [ ] Bulk email sending
- [ ] Email analytics dashboard
- [ ] A/B testing for templates
- [ ] Scheduled email campaigns
- [ ] Email preview in browser

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Gmail rate limits exceeded | High | Implement rate limiting, queue throttling |
| Redis connection failure | Medium | Graceful degradation, fallback to DB polling |
| SMTP credentials invalid | High | Health check on startup, alert monitoring |
| Token secret leaked | Critical | Secret rotation procedure, audit logging |
| Worker crashes | Medium | PM2 process manager, auto-restart |
| Database connection pool exhausted | Medium | Connection pooling config, worker concurrency limits |

---

## Conclusion

This plan provides a complete roadmap for implementing a production-grade email system in Sprint-1. The architecture is:

- **Scalable:** BullMQ handles high throughput
- **Reliable:** Retry logic and error handling
- **Secure:** HMAC-signed tokens, hash storage
- **Testable:** Test transport and comprehensive tests
- **Maintainable:** Clear separation of concerns
- **Observable:** Logging and monitoring built-in

**Estimated total time:** 11-19 hours depending on familiarity with the tech stack.

**Ready for implementation:** Yes, after Phase A approval