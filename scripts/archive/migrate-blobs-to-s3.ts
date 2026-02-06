/**
 * Data Migration Script: BLOB to S3
 * Migrates existing BLOB data to MinIO/S3
 */
import { db } from '@/lib/db';
import { s3Service } from '@/lib/storage/s3-service';

// Progress tracking
let totalImages = 0;
let migratedImages = 0;
let failedImages = 0;
let totalMedia = 0;
let migratedMedia = 0;
let failedMedia = 0;

/**
 * Migrate Image BLOBs to S3
 */
async function migrateImageBlobsToS3() {
  console.log('\n🚀 Starting Image BLOB → S3 migration...\n');

  const images = await db.image.findMany({
    where: {
      data: { not: null },    // Has BLOB data
      s3Key: null,            // Not yet migrated
    },
  });

  totalImages = images.length;
  console.log(`📦 Found ${totalImages} images to migrate\n`);

  if (totalImages === 0) {
    console.log('✅ No images to migrate!\n');
    return;
  }

  for (const image of images) {
    try {
      if (!image.data) {
        console.log(`⏭️  Skipping image ${image.id} (no data)`);
        continue;
      }

      // Generate S3 key
      const filename = image.filename || image.originalName || `image-${image.id}.jpg`;
      const s3Key = s3Service.generateKey('image', filename, image.id);

      // Upload to S3
      const { url, s3Key: uploadedKey, bucket } = await s3Service.uploadFile(
        Buffer.from(image.data),
        s3Key,
        image.type || image.mimeType || 'image/jpeg'
      );

      // Update database record
      await db.image.update({
        where: { id: image.id },
        data: {
          url,
          s3Key: uploadedKey,
          s3Bucket: bucket,
          mimeType: image.type || image.mimeType,
          filename: filename,
          originalName: filename,
          // Keep 'data' field for rollback capability
        },
      });

      migratedImages++;
      const progress = ((migratedImages / totalImages) * 100).toFixed(1);
      console.log(`✅ [${progress}%] Migrated image ${image.id}`);
      console.log(`   → ${url}\n`);
    } catch (error) {
      failedImages++;
      console.error(`❌ Failed to migrate image ${image.id}:`, error);
      console.error(`   Error: ${error instanceof Error ? error.message : 'Unknown'}\n`);
    }
  }

  console.log(`\n📊 Image Migration Summary:`);
  console.log(`   Total: ${totalImages}`);
  console.log(`   ✅ Migrated: ${migratedImages}`);
  console.log(`   ❌ Failed: ${failedImages}\n`);
}

/**
 * Migrate Media BLOBs to S3
 */
async function migrateMediaBlobsToS3() {
  console.log('\n🚀 Starting Media BLOB → S3 migration...\n');

  const mediaFiles = await db.media.findMany({
    where: {
      data: { not: null },
      s3Key: null,
    },
  });

  totalMedia = mediaFiles.length;
  console.log(`📦 Found ${totalMedia} media files to migrate\n`);

  if (totalMedia === 0) {
    console.log('✅ No media files to migrate!\n');
    return;
  }

  for (const media of mediaFiles) {
    try {
      if (!media.data) {
        console.log(`⏭️  Skipping media ${media.id} (no data)`);
        continue;
      }

      // Generate S3 key
      const filename = media.filename || media.originalName || `media-${media.id}`;
      const s3Key = s3Service.generateKey('media', filename, media.id);

      // Upload to S3
      const { url, s3Key: uploadedKey, bucket } = await s3Service.uploadFile(
        Buffer.from(media.data),
        s3Key,
        media.type || media.mimeType || 'application/octet-stream'
      );

      // Update database record
      await db.media.update({
        where: { id: media.id },
        data: {
          url,
          s3Key: uploadedKey,
          s3Bucket: bucket,
          mimeType: media.type || media.mimeType,
          filename: filename,
          originalName: filename,
          // Keep 'data' field for rollback capability
        },
      });

      migratedMedia++;
      const progress = ((migratedMedia / totalMedia) * 100).toFixed(1);
      console.log(`✅ [${progress}%] Migrated media ${media.id}`);
      console.log(`   → ${url}\n`);
    } catch (error) {
      failedMedia++;
      console.error(`❌ Failed to migrate media ${media.id}:`, error);
      console.error(`   Error: ${error instanceof Error ? error.message : 'Unknown'}\n`);
    }
  }

  console.log(`\n📊 Media Migration Summary:`);
  console.log(`   Total: ${totalMedia}`);
  console.log(`   ✅ Migrated: ${migratedMedia}`);
  console.log(`   ❌ Failed: ${failedMedia}\n`);
}

/**
 * Main migration function
 */
async function main() {
  const startTime = Date.now();

  console.log('═══════════════════════════════════════════');
  console.log('  BLOB → S3 Migration Script');
  console.log('═══════════════════════════════════════════\n');

  try {
    // Migrate Images
    await migrateImageBlobsToS3();

    // Migrate Media
    await migrateMediaBlobsToS3();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n═══════════════════════════════════════════');
    console.log('  Migration Complete!');
    console.log('═══════════════════════════════════════════\n');
    console.log(`⏱️  Duration: ${duration}s`);
    console.log(`📊 Images: ${migratedImages}/${totalImages} (${failedImages} failed)`);
    console.log(`📊 Media: ${migratedMedia}/${totalMedia} (${failedMedia} failed)\n`);

    if (failedImages > 0 || failedMedia > 0) {
      console.log('⚠️  Some files failed to migrate. Check errors above.\n');
      process.exit(1);
    } else {
      console.log('✅ All files migrated successfully!\n');
      process.exit(0);
    }
  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

// Run migration
main();
