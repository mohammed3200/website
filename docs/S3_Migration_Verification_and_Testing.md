# S3 Migration - Plan Verification & Next Steps

## ✅ Accuracy Verification

### Implementation Guide Review

I've verified the **Complete BLOB to S3 Migration Implementation Guide** against the actual implementation. Here's the accuracy assessment:

| Component | Guide Specification | Actual Implementation | Status |
|:----------|:-------------------|:---------------------|:-------|
| **S3 Service** | `src/lib/storage/s3-service.ts` with exact methods | ✅ Created exactly as specified | ✅ MATCHES |
| **Prisma Schema** | S3 fields added to Image/Media models | ✅ Already contains s3Key, s3Bucket fields | ✅ MATCHES |
| **SQL Migration** | Add s3Key/s3Bucket columns + indexes | ✅ Created in `migrations/20260205_add_s3_fields/` | ✅ MATCHES |
| **Collaborators API** | S3 upload for images/media | ✅ Updated with s3Service imports and upload logic | ✅ MATCHES |
| **Innovators API** | S3 upload for images/project files | ✅ Updated with s3Service imports and upload logic | ✅ MATCHES |
| **Migration Script** | `scripts/migrate-blobs-to-s3.ts` | ✅ Created with progress tracking and error handling | ✅ MATCHES |
| **Verification Script** | `scripts/verify-s3-migration.ts` | ✅ Created with connectivity check | ✅ MATCHES |
| **Environment Vars** | S3_ENDPOINT, AWS_*, S3_BUCKET_NAME | ✅ Configured in `.env` | ✅ MATCHES |
| **Package Scripts** | `migrate:s3`, `verify:s3` | ✅ Added to `package.json` | ✅ MATCHES |
| **MinIO Setup Script** | `setup-minio-bucket.ts` | ✅ Created with env var support | ✅ UPDATED (now uses env vars) |

### ⚠️ Minor Discrepancies Fixed

1. **Import Optimization:** Changed from dynamic `await import()` to static imports for better tree-shaking
2. **Dotenv Loading:** Added `import 'dotenv/config'` to `setup-minio-bucket.ts` for standalone execution
3. **Type Safety:** Fixed `Uint8Array` → `Buffer` conversion in migration script

### Implementation Integrity: **100% ✅**

The guide is accurate and all code has been implemented according to spec. The implementation is production-ready for Phase 3 testing.

---

## 📋 Phase 3: Testing Checklist

### Prerequisites
- [ ] MinIO container running (`docker-compose ps minio`)
- [ ] Database accessible (`npm run db:test`)
- [ ] Environment variables loaded (check `.env`)

### Step 1: Apply Prisma Migration

```bash
# Apply the SQL migration to add S3 fields
npm run db:push
# OR
npx prisma migrate deploy
```

**Expected Output:**
```
✔ Migration `20260205_add_s3_fields` applied successfully.
```

**Verify:**
```bash
npx prisma studio
# Browse to Image/Media models
# Confirm s3Key and s3Bucket columns exist
```

---

### Step 2: Create MinIO Bucket

```bash
# Run the setup script
npm run setup:minio
# OR manually via tsx
npx tsx scripts/setup-minio-bucket.ts
```

**Expected Output:**
```
✅ Created bucket: website-media
✅ Set public access policy for bucket: website-media
🎉 MinIO bucket setup complete!
📦 Bucket: website-media
🌐 URL: http://localhost:9000/website-media
```

**Manual Verification:**
1. Open http://localhost:9001 in browser
2. Login: `minioadmin` / `minioadmin`
3. Verify `website-media` bucket exists
4. Check bucket is set to **Public** access

---

### Step 3: Test New File Uploads

#### Test Innovators Registration

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/en/innovators/registration/1`
3. Fill out the form:
   - Name, email, phone
   - Upload profile image (PNG/JPG, < 5MB)
   - Upload project files (PDF/DOCX)
4. Submit form

**Expected Behavior:**
- ✅ Form submits successfully
- ✅ No errors in browser console
- ✅ No errors in server terminal

**Database Verification:**
```bash
npx prisma studio
# Navigate to Image table
# Find the latest record
# Verify:
#   - s3Key: "images/{id}/{timestamp}-{filename}"
#   - s3Bucket: "website-media"
#   - url: "http://localhost:9000/website-media/images/..."
#   - data: NULL (new records shouldn't have BLOB)
```

**MinIO Verification:**
1. Open http://localhost:9001
2. Browse `website-media` bucket
3. Navigate to `images/{id}/` folder
4. Verify file exists and can be previewed

#### Test Collaborators Registration

1. Navigate to: `http://localhost:3000/en/collaborators/registration/1`
2. Fill out form + upload company logo and media files
3. Submit

**Verify same as above** (check Media table for media files, Image table for logo)

---

### Step 4: Test File Retrieval

#### Public API Endpoint Test

```bash
# Test collaborators public endpoint
curl http://localhost:3000/api/collaborators/public | jq
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "...",
      "companyName": "...",
      "image": {
        "url": "http://localhost:9000/website-media/images/...",
        "mimeType": "image/jpeg",
        "size": 123456
      }
    }
  ]
}
```

**Critical Checks:**
- ✅ `image.url` is a direct MinIO URL (not base64)
- ✅ No `data` field in response
- ✅ Response size is ~90% smaller than before

#### Frontend Visual Test

1. Navigate to public collaborators page
2. **Open Browser Dev Tools → Network tab**
3. Reload page
4. **Critical Verification:**
   - ✅ Images load correctly
   - ✅ Image requests go to `http://localhost:9000/website-media/...`
   - ✅ Images are NOT embedded as data URIs
   - ✅ Page loads faster than before

---

### Step 5: Run Verification Script

```bash
npm run verify:s3
```

**Expected Output:**
```
🔍 Verifying S3 Migration...

📷 Checking Images...
   Total Images: X
   ✅ Migrated: Y (new records only)
   ⏳ Pending: Z (old BLOB records)

📁 Checking Media...
   Total Media: X
   ✅ Migrated: Y
   ⏳ Pending: Z

☁️  Checking S3 Connectivity...
   ✅ S3 Access: OK

📊 Migration Progress: X%
   (Y/Z files)
```

---

## 🚀 Phase 4: Data Migration (When Ready)

> [!CAUTION]
> **DO NOT RUN UNTIL PHASE 3 TESTING IS COMPLETE AND SUCCESSFUL**

### Step 1: Backup Database

```bash
# Create timestamped backup
docker exec website-db mysqldump -u root -proot citcoder_eitdc > backup-$(date +%Y%m%d-%H%M%S).sql

# Verify backup file exists and is not empty
ls -lh backup-*.sql
```

### Step 2: Run Migration

```bash
npm run migrate:s3
```

**What This Does:**
1. Finds all Image/Media records with `data != NULL` and `s3Key == NULL`
2. Uploads each BLOB to MinIO
3. Updates database record with S3 URL and key
4. **Preserves** BLOB data (for rollback safety)

**Expected Duration:** ~1 minute per 100 files

### Step 3: Verify Success

```bash
npm run verify:s3
```

**Success Criteria:**
- Migration Progress: **100%**
- Failed files: **0**
- S3 Access: **OK**

### Step 4: Test Old Records

1. Navigate to public pages (collaborators/innovators)
2. Verify **old** records (uploaded before migration) still display images
3. Check that images are now served from MinIO

---

## 📊 Integration with Task 22 Roadmap

The S3 migration directly addresses **Task 22: Architectural Debt Elimination**, specifically:

### Media Storage Refactor (Checklist from Roadmap)

- [x] **Implement Object Storage:** MinIO configured and ready
- [x] **Schema Refactor:** S3 fields added to Image/Media models
- [ ] **Migration Strategy:** ← **PHASE 4 (Next Step)**
  - [ ] Extract existing BLOBs from DB
  - [ ] Upload to MinIO
  - [ ] Update DB records with URLs
  - [ ] Verify data integrity
- [x] **API Updates:** Innovators and Collaborators upload to S3

### Remaining Work

**Current Status:**
```
Phase 1: Setup          ✅ 100% Complete
Phase 2: Implementation ✅ 100% Complete
Phase 3: Testing        ⏳ 0% Complete   ← YOU ARE HERE
Phase 4: Data Migration ⏳ 0% Pending
Phase 5: Cleanup        ⏳ 0% Pending
```

**To Fully Complete Task 22 - Media Storage:**
1. Complete Phase 3 testing (this checklist)
2. Run Phase 4 data migration
3. Monitor for 1 week (Phase 5)
4. Remove BLOB fields from schema (final cleanup)

---

## 🎯 Immediate Next Steps

1. **Apply Prisma migration:** `npm run db:push`
2. **Create MinIO bucket:** `npx tsx scripts/setup-minio-bucket.ts`
3. **Test new uploads:** Register a test innovator/collaborator
4. **Verify files in MinIO:** Check console at http://localhost:9001
5. **Run verification:** `npm run verify:s3`

Once all Phase 3 tests pass, you're ready for Phase 4 (data migration).

---

## ⚠️ Known Limitations & Future Work

### Not Yet Migrated
- **News API** - Still uses BLOB storage
- **Strategic Plans API** - Still uses BLOB storage

### Production Deployment Notes
- MinIO volumes must be backed up separately
- Consider CloudFlare R2 or AWS S3 for production (zero-config swap via env vars)
- Add CDN URL to env vars for better global performance

---

## 📚 Reference Documents

- [Complete Implementation Guide](file:///c:/Users/iG/Documents/Next.JS/website/docs/Complete%20BLOB%20to%20S3%20Migration%20Implementation%20Guide.md) - Full technical specification
- [Progress Tracker](file:///c:/Users/iG/Documents/Next.JS/website/docs/S3%20Migration%20Implementation%20Progress.md) - Phase completion status
- [Walkthrough](file:///C:/Users/iG/.gemini/antigravity/brain/f56bbf2f-4162-420c-a170-d71ed715e78d/walkthrough.md) - What was implemented in Phase 2
- [Task 22](file:///c:/Users/iG/Documents/Next.JS/website/PROJECT_TASKS_ROADMAP.md#task-22-architectural-debt-elimination--system-hardening) - Project roadmap context
