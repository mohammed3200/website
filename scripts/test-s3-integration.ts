/**
 * Integration Test: S3 Upload & DB Flow
 * Simulates a file upload to verify S3 service and DB storage work together
 */
import { db } from '@/lib/db';
import { s3Service } from '@/lib/storage/s3-service';
import { v4 as uuidv4 } from 'uuid';

async function testS3Integration() {
    console.log('\n🧪 Starting S3 Integration Test...\n');

    try {
        // 1. Create dummy file data
        console.log('1️⃣  Generating test file...');
        const testBuffer = Buffer.from('Integration Test File Content - ' + new Date().toISOString());
        const testId = uuidv4();
        const filename = `test-file-.txt`;
        const s3Key = s3Service.generateKey('media', filename, testId);

        console.log(`   ID: ${testId}`);
        console.log(`   Key: ${s3Key}`);
        console.log(`   Content Length: ${testBuffer.length} bytes\n`);

        // 2. Upload to S3
        console.log('2️⃣  Uploading to S3...');
        const startTime = Date.now();
        const { url, s3Key: uploadedKey, bucket } = await s3Service.uploadFile(
            testBuffer,
            s3Key,
            'text/plain'
        );
        const duration = Date.now() - startTime;
        console.log(`   ✅ Upload successful in ${duration}ms`);
        console.log(`   Bucket: ${bucket}`);
        console.log(`   URL: ${url}\n`);

        // 3. Verify in S3
        console.log('3️⃣  Verifying file exists in S3...');
        const exists = await s3Service.fileExists(uploadedKey);
        console.log(`   ${exists ? '✅' : '❌'} File exists: ${exists}\n`);

        if (!exists) throw new Error('File not found in S3 after upload');

        // 4. Create DB Record (Simulating API logic)
        console.log('4️⃣  Creating DB Record...');
        const media = await db.media.create({
            data: {
                id: testId,
                filename: uploadedKey,
                originalName: filename,
                mimeType: 'text/plain',
                size: testBuffer.length,
                url: url,
                s3Key: uploadedKey,
                s3Bucket: bucket,
                // No BLOB data! (Simulating new clean upload)
                type: 'text/plain'
            }
        });
        console.log(`   ✅ DB Record created: ${media.id}\n`);

        // 5. Verify DB Record
        console.log('5️⃣  Reading back from DB...');
        const savedMedia = await db.media.findUnique({
            where: { id: testId }
        });

        if (!savedMedia) throw new Error('Could not find record in DB');
        if (savedMedia.s3Key !== uploadedKey) throw new Error('DB s3Key mismatch');
        if (savedMedia.url !== url) throw new Error('DB URL mismatch');

        console.log(`   ✅ DB Record verified correctly\n`);

        // 6. Cleanup (Optional)
        // await s3Service.deleteFile(uploadedKey);
        // await db.media.delete({ where: { id: testId } });

        console.log('═══════════════════════════════════════════');
        console.log('🎉 S3 INTEGRATION TEST PASSED!');
        console.log('═══════════════════════════════════════════\n');
        console.log('The system is ready for use.');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ TEST FAILED:', error);
        process.exit(1);
    } finally {
        await db.$disconnect();
    }
}

testS3Integration();
