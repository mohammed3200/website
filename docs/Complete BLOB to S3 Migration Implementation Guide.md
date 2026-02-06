# Complete BLOB to S3 Migration Implementation Guide
## 100% FREE & Self-Hosted with MinIO

> [!IMPORTANT]
> **This solution is COMPLETELY FREE with ZERO external costs!**
> - MinIO is open-source and self-hosted on YOUR server
> - No cloud services, no subscriptions, no vendor lock-in
> - All files stay on your infrastructure

## Table of Contents
1. [Problem Analysis](#problem-analysis)
2. [Solution Overview](#solution-overview)
3. [Complete Implementation](#complete-implementation)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Verification & Testing](#verification--testing)

---

## Problem Analysis

### 🔴 Critical Issues Identified

#### Issue #1: Database BLOB Storage
**Location:** `prisma/schema.prisma`

- **Line 179:** `Image` model - `data: Bytes?`
- **Line 200:** `Media` model - `data: Bytes?`

**Problem:**
```prisma
model Image {
  data Bytes?  // ⚠️ Stores entire file in database
}

model Media {
  data Bytes?  // ⚠️ Stores entire file in database
}
```

**Impact:**
- 1000 images × 500KB = **500MB stored in database**
- PaaS database cost: **$150-300/month** for storage
- Memory overhead when retrieving images
- Slow query performance
- Database backup size explosion
- Migration time increases dramatically

**Affected Features:**
- **Collaborators** (`src/features/collaborators/server/route.ts`)
  - Company logos (Image table)
  - Experience media files (Media table)
  - Machinery/equipment media (Media table)
- **Innovators** (`src/features/innovators/server/route.ts`)
  - Profile images (Image table)
  - Project files - PDF, DOCX, images (Media table)
- **News** (Image table)
  - Feature images
  - Gallery images
- **Strategic Plans** (Image table)
  - Plan cover images

#### Issue #2: Base64 Encoding Overhead
**Location:** `src/features/collaborators/server/route.ts` (lines 63-68)

```typescript
// Current implementation
image: image
  ? {
    data: Buffer.isBuffer(image.data)
      ? image.data.toString('base64')  // ⚠️ Converts entire BLOB to base64
      : '',
    type: image.type,
  }
  : null,
```

**Problem:**
- Base64 encoding increases size by **~33%**
- 500KB image becomes **665KB** in transit
- High memory usage on server
- Slow JSON parsing on client
- Network bandwidth waste

#### Issue #3: Resource Consumption
**Current Architecture:**
```
User Upload → API → Database BLOB → API → Base64 → Client
              ↓
         500KB file becomes:
         - 500KB in database
         - 665KB in network transfer
         - High RAM usage during conversion
```

**Measured Impact:**
- **Database size:** Grows rapidly with each upload
- **Memory usage:** Spike on each image retrieval
- **Response time:** Slow due to encoding
- **Bandwidth:** Wasted on base64 overhead

---

## Solution Overview

### ✅ Recommended Solution: MinIO (100% FREE)

**Why MinIO?**
- 🆓 **Completely FREE** - Open source, self-hosted, zero licensing costs
- 🏠 **Runs on YOUR Server** - No external dependencies or cloud services
- 💾 **Minimal Resources** - Uses same infrastructure you already have
- 🔒 **Full Control** - All files stay on your infrastructure
- 🚀 **S3 Compatible** - Can migrate to AWS S3 later if needed (but not required)
- ⚡ **High Performance** - Faster than database BLOBs
- 📈 **Scalable** - Just add more disk space as needed

> [!NOTE]
> MinIO is installed via Docker alongside your existing database and Redis containers. It uses your server's disk storage (which you already pay for) - no additional costs!

### New Architecture

**Upload Flow:**
`User → API → MinIO (on YOUR server) → Database (save URL only) → Return URL`

**Retrieval Flow:**
`User → API → Database (get URL) → Return URL → Browser fetches from MinIO (on YOUR server)`

**Benefits:**
- **Database size:** 500MB → <10MB (98% reduction)
- **Response time:** Direct URL return (no encoding)
- **Memory:** Minimal (only store URLs)
- **Bandwidth:** Direct file serve (no base64)
- **Storage Cost:** $0 (uses your existing server disk)
- **Database Cost:** Reduced to ~$10-20/month (normal PaaS pricing)
- **Total Additional Cost:** $0 (completely free!)

---

## Complete Implementation

### 📁 File 1: MinIO Service Module
**Create:** `src/lib/storage/s3-service.ts`

```typescript
/**
 * S3-Compatible Storage Service (MinIO/AWS S3)
 * Handles file upload, download, and deletion
 */
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3StorageService {
  private client: S3Client;
  private bucket: string;
  private publicAccess: boolean;
  private cdnUrl?: string;

  constructor() {
    // Initialize S3 client (works with both MinIO and AWS S3)
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.S3_ENDPOINT, // For MinIO: http://localhost:9000
      forcePathStyle: !!process.env.S3_ENDPOINT, // Required for MinIO
    });

    this.bucket = process.env.S3_BUCKET_NAME || 'website-media';
    this.publicAccess = process.env.S3_PUBLIC_ACCESS === 'true';
    this.cdnUrl = process.env.CDN_URL;
  }

  /**
   * Upload file to S3/MinIO
   * @param file - Buffer containing file data
   * @param key - S3 object key (path/filename)
   * @param contentType - MIME type
   * @returns URL and S3 key
   */
  async uploadFile(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<{ url: string; s3Key: string; bucket: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: this.publicAccess ? 'public-read' : 'private',
      CacheControl: 'max-age=31536000', // Cache for 1 year
    });

    await this.client.send(command);

    // Generate URL
    const url = this.generatePublicUrl(key);

    return {
      url,
      s3Key: key,
      bucket: this.bucket,
    };
  }

  /**
   * Generate public URL for S3 object
   */
  private generatePublicUrl(key: string): string {
    if (this.cdnUrl) {
      // Use CDN URL if configured
      return `${this.cdnUrl}/${key}`;
    }
    if (process.env.S3_ENDPOINT) {
      // MinIO URL
      return `${process.env.S3_ENDPOINT}/${this.bucket}/${key}`;
    }
    // AWS S3 URL
    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  /**
   * Generate presigned URL for temporary access (private files)
   * @param key - S3 object key
   * @param expiresIn - Expiration time in seconds (default: 1 hour)
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return await getSignedUrl(this.client, command, { expiresIn });
  }

  /**
   * Delete file from S3/MinIO
   * @param key - S3 object key
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.client.send(command);
      console.log(`✅ Deleted file from S3: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to delete file from S3: ${key}`, error);
      throw error;
    }
  }

  /**
   * Check if file exists in S3/MinIO
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate unique S3 key from file metadata
   * Format: {type}s/{id}/{timestamp}-{sanitized-filename}
   */
  generateKey(
    type: 'image' | 'media',
    filename: string,
    id: string
  ): string {
    const timestamp = Date.now();
    const sanitized = filename
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/__+/g, '_')
      .toLowerCase();
    return `${type}s/${id}/${timestamp}-${sanitized}`;
  }

  /**
   * Get file extension from filename
   */
  getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }
}

// Singleton instance
export const s3Service = new S3StorageService();
```

### 📁 File 2: Environment Variables
**Update:** `.env` (for development)

```bash
# S3/MinIO Configuration

# For MinIO (Development - Minimal Resources)
S3_ENDPOINT="http://localhost:9000"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="website-media"
S3_PUBLIC_ACCESS="true"

# For AWS S3 (Production - Scalable)
# S3_ENDPOINT=  # Leave empty for AWS S3
# AWS_ACCESS_KEY_ID=your_aws_access_key
# AWS_SECRET_ACCESS_KEY=your_aws_secret_key
# AWS_REGION=us-east-1
# S3_BUCKET_NAME=your-production-bucket
# S3_PUBLIC_ACCESS=true

# Optional: CDN URL (CloudFlare R2, CloudFront, etc.)
# CDN_URL=https://cdn.yourdomain.com
```

**Update:** `.env.production.template`
Add this section:

```bash
# ==============================================
# S3/OBJECT STORAGE CONFIGURATION
# ==============================================

# IMPORTANT: Choose ONE of the following configurations

# Option 1: MinIO (Self-Hosted - Minimal Cost)
# Recommended for: Small to medium deployments, budget-conscious
# S3_ENDPOINT=http://minio:9000
# AWS_ACCESS_KEY_ID=minioadmin
# AWS_SECRET_ACCESS_KEY=[CHANGE_THIS_PASSWORD]
# AWS_REGION=us-east-1
# S3_BUCKET_NAME=website-media
# S3_PUBLIC_ACCESS=true

# Option 2: AWS S3 (Cloud - Scalable)
# Recommended for: Large deployments, global CDN needed
# S3_ENDPOINT=  # Leave empty for AWS S3
# AWS_ACCESS_KEY_ID=[YOUR_AWS_ACCESS_KEY]
# AWS_SECRET_ACCESS_KEY=[YOUR_AWS_SECRET_KEY]
# AWS_REGION=us-east-1
# S3_BUCKET_NAME=[YOUR_BUCKET_NAME]
# S3_PUBLIC_ACCESS=true

# Option 3: Cloudflare R2 (Zero Egress Fees)
# Recommended for: High traffic, cost optimization
# S3_ENDPOINT=https://[ACCOUNT_ID].r2.cloudflarestorage.com
# AWS_ACCESS_KEY_ID=[R2_ACCESS_KEY_ID]
# AWS_SECRET_ACCESS_KEY=[R2_SECRET_ACCESS_KEY]
# AWS_REGION=auto
# S3_BUCKET_NAME=[R2_BUCKET_NAME]
# S3_PUBLIC_ACCESS=true

# Optional: CDN URL for faster delivery
# CDN_URL=https://cdn.yourdomain.com
```

### 📁 File 3: Prisma Migration (Step 1 - Add S3 Fields)
**Create:** `prisma/migrations/20260205_add_s3_fields/migration.sql`

```sql
-- Migration: Add S3 fields to Image and Media tables
-- This migration adds new fields without removing existing BLOB fields
-- to allow for a gradual migration

-- Add S3 fields to Image table
ALTER TABLE `Image` 
  ADD COLUMN `s3Key` VARCHAR(500) NULL AFTER `url`,
  ADD COLUMN `s3Bucket` VARCHAR(191) NULL AFTER `s3Key`;

-- Add S3 fields to Media table
ALTER TABLE `Media`
  ADD COLUMN `s3Key` VARCHAR(500) NULL AFTER `url`,
  ADD COLUMN `s3Bucket` VARCHAR(191) NULL AFTER `s3Key`;

-- Add indexes for better query performance
CREATE INDEX `Image_s3Key_idx` ON `Image`(`s3Key`);
CREATE INDEX `Media_s3Key_idx` ON `Media`(`s3Key`);

-- Add comment to track migration status
ALTER TABLE `Image` COMMENT = 'S3 fields added - BLOB migration in progress';
ALTER TABLE `Media` COMMENT = 'S3 fields added - BLOB migration in progress';
```

**Update:** `prisma/schema.prisma`

```prisma
model Image {
  id            String          @id @default(cuid())
  filename      String?
  originalName  String?
  url           String?          // S3 public URL
  s3Key         String?          // NEW: S3 object key
  s3Bucket      String?          // NEW: S3 bucket name
  mimeType      String?
  size          Int?
  width         Int?
  height        Int?
  alt           String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  data          Bytes?          // DEPRECATED: Will be removed after migration
  type          String?         // DEPRECATED: Use mimeType instead
  collaborators Collaborator[]
  innovators    Innovator[]
  news          News[]
  StrategicPlan StrategicPlan[]

  @@index([filename])
  @@index([mimeType])
  @@index([s3Key])
}

model Media {
  id                         String                       @id @default(cuid())
  filename                   String?
  originalName               String?
  url                        String?          // S3 public URL
  s3Key                      String?          // NEW: S3 object key
  s3Bucket                   String?          // NEW: S3 bucket name
  mimeType                   String?
  size                       Int?
  duration                   Int?
  createdAt                  DateTime                     @default(now())
  updatedAt                  DateTime                     @updatedAt
  data                       Bytes?          // DEPRECATED: Will be removed after migration
  type                       String?         // DEPRECATED: Use mimeType instead
  experienceProvidedMedia    ExperienceProvidedMedia[]
  innovatorProjectFiles      InnovatorProjectFile[]
  machineryAndEquipmentMedia MachineryAndEquipmentMedia[]

  @@index([filename])
  @@index([mimeType])
  @@index([s3Key])
}
```

### 📁 File 4: Updated Collaborators API
**Update:** `src/features/collaborators/server/route.ts`

Replace lines 137-148 with:
```typescript
import { s3Service } from '@/lib/storage/s3-service';

// ... existing code ...

// Create image record if image exists (UPDATED)
let imageId: string | null = null;
if (image instanceof File) {
  const imageBuffer = Buffer.from(await image.arrayBuffer());
  const imageKey = s3Service.generateKey('image', image.name, uuidv4());
  
  const { url, s3Key, bucket } = await s3Service.uploadFile(
    imageBuffer,
    imageKey,
    image.type
  );

  const imageRecord = await db.image.create({
    data: {
      url,
      s3Key,
      s3Bucket: bucket,
      mimeType: image.type,
      size: image.size,
      originalName: image.name,
      filename: imageKey,
    },
  });
  imageId = imageRecord.id;
}
```

Replace lines 159-165 with:
```typescript
// Create media records helper (UPDATED)
const createMediaRecords = async (
  files: File[],
  type: 'experience' | 'machinery',
) => {
  return Promise.all(
    files.map(async (file) => {
      // Upload to S3
      const mediaBuffer = Buffer.from(await file.arrayBuffer());
      const mediaKey = s3Service.generateKey('media', file.name, uuidv4());
      
      const { url, s3Key, bucket } = await s3Service.uploadFile(
        mediaBuffer,
        mediaKey,
        file.type
      );

      // Create media record with S3 data
      const mediaRecord = await db.media.create({
        data: {
          url,
          s3Key,
          s3Bucket: bucket,
          mimeType: file.type,
          size: file.size,
          originalName: file.name,
          filename: mediaKey,
        },
      });

      // Create relation record based on type
      if (type === 'experience') {
        return db.experienceProvidedMedia.create({
          data: {
            id: uuidv4(),
            media: mediaRecord.id,
            collaboratorId: collaborator.id,
          },
        });
      } else {
        return db.machineryAndEquipmentMedia.create({
          data: {
            id: uuidv4(),
            media: mediaRecord.id,
            collaboratorId: collaborator.id,
          },
        });
      }
    }),
  );
};
```

### 📁 File 8: Update package.json
**Update:** `package.json`

Add to dependencies:
```json
{
  "dependencies": {
    "@aws-sdk/client-s3": "^3.515.0",
    "@aws-sdk/s3-request-presigner": "^3.515.0"
  }
}
```

Add to scripts:
```json
{
  "scripts": {
    "setup:minio": "tsx scripts/setup-minio-bucket.ts",
    "migrate:s3": "tsx scripts/migrate-blobs-to-s3.ts",
    "verify:s3": "tsx scripts/verify-s3-migration.ts"
  }
}
```

### 📁 File 9: Docker Compose (MinIO Setup)
**Update:** `docker-compose.yml`

Add MinIO service:
```yaml
services:
  # ... existing services (app, db, redis) ...
  
  minio:
    image: minio/minio:latest
    container_name: website-minio
    restart: always
    ports:
      - "9000:9000"      # API port
      - "9001:9001"      # Console UI
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - minio-data:/data
    command: server /data --console-address ":9001"
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  db-data:
  redis-data:
  minio-data:    # NEW: MinIO storage volume

networks:
  app-network:
    driver: bridge
```

---

## Step-by-Step Deployment

### Phase 1: Setup (20 minutes)

**Step 1.1: Install Dependencies**
```bash
# Install AWS SDK (works with MinIO too)
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

**Step 1.2: Start MinIO**
```bash
# Start MinIO via Docker Compose
docker-compose up -d minio

# Check MinIO is running
docker-compose ps minio
```

**Step 1.3: Create S3 Bucket**
```bash
# Run setup script
npm run setup:minio
```

**Step 1.4: Add Environment Variables**
Update `.env` as shown in File 2.

### Phase 2: Code Implementation (30 minutes)
1. Create `src/lib/storage/s3-service.ts`
2. Create and apply Prisma migration
3. Update API routes
4. Create migration scripts

### Phase 3: Testing & Verification
1. Run verification script: `npm run verify:s3`
2. Test manual uploads via registration form
3. Verify files appear in MinIO console

### Phase 4: Data Migration (Variable time)
1. Backup database: `docker exec website-db mysqldump ...`
2. Run migration: `npm run migrate:s3`
3. Verify success: `npm run verify:s3`

---

## Verification & Testing

### Test Upload (New Files)
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/en/collaborators/registration/1`
3. Fill form and upload image
4. Check MinIO Console: `http://localhost:9001`
5. Verify file appears in 'website-media' bucket

### Verify S3 Connectivity
```bash
npm run verify:s3
```
Expected output:
```
☁️  Checking S3 Connectivity...
   ✅ S3 Access: OK
```