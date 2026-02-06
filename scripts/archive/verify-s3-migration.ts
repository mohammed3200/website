/**
 * Verification Script: Check S3 Migration Status
 * Verifies that all files are properly migrated
 */
import { db } from '@/lib/db';
import { s3Service } from '@/lib/storage/s3-service';

async function verifyMigration() {
  console.log('\n🔍 Verifying S3 Migration...\n');

  // Check Images
  console.log('📷 Checking Images...');
  const totalImages = await db.image.count();
  const migratedImages = await db.image.count({
    where: {
      s3Key: { not: null },
      url: { not: null },
    },
  });
  const unmigratedImages = await db.image.count({
    where: {
      data: { not: null },
      s3Key: null,
    },
  });

  console.log(`   Total Images: ${totalImages}`);
  console.log(`   ✅ Migrated: ${migratedImages}`);
  console.log(`   ⏳ Pending: ${unmigratedImages}\n`);

  // Check Media
  console.log('📁 Checking Media...');
  const totalMedia = await db.media.count();
  const migratedMedia = await db.media.count({
    where: {
      s3Key: { not: null },
      url: { not: null },
    },
  });
  const unmigratedMedia = await db.media.count({
    where: {
      data: { not: null },
      s3Key: null,
    },
  });

  console.log(`   Total Media: ${totalMedia}`);
  console.log(`   ✅ Migrated: ${migratedMedia}`);
  console.log(`   ⏳ Pending: ${unmigratedMedia}\n`);

  // Check S3 connectivity
  console.log('☁️  Checking S3 Connectivity...');
  try {
    const testImage = await db.image.findFirst({
      where: { s3Key: { not: null } },
    });
    if (testImage?.s3Key) {
      const exists = await s3Service.fileExists(testImage.s3Key);
      console.log(`   ${exists ? '✅' : '❌'} S3 Access: ${exists ? 'OK' : 'FAILED'}\n`);
    } else {
      console.log('   ⏭️  No migrated files to test\n');
    }
  } catch (error) {
    console.log(`   ❌ S3 Access: FAILED`);
    console.error(`   Error: ${error instanceof Error ? error.message : error}\n`);
  }

  // Summary
  const totalFiles = totalImages + totalMedia;
  const migratedFiles = migratedImages + migratedMedia;
  const percentage = totalFiles > 0 ? ((migratedFiles / totalFiles) * 100).toFixed(1) : 0;

  console.log('═══════════════════════════════════════════');
  console.log(`📊 Migration Progress: ${percentage}%`);
  console.log(`   (${migratedFiles}/${totalFiles} files)`);
  console.log('═══════════════════════════════════════════\n');

  await db.$disconnect();
}

verifyMigration();
