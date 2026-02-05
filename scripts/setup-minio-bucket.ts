/**
 * MinIO Bucket Setup Script
 * Creates the 'website-media' bucket with public access policy
 */

import { S3Client, CreateBucketCommand, PutBucketPolicyCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

const client = new S3Client({
    endpoint: 'http://localhost:9000',
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
    },
    forcePathStyle: true,
});

const bucketName = 'website-media';

async function createBucket() {
    try {
        // Check if bucket already exists
        try {
            await client.send(new HeadBucketCommand({ Bucket: bucketName }));
            console.log(`✅ Bucket '${bucketName}' already exists!`);
            return;
        } catch (error: any) {
            if (error.name !== 'NotFound') {
                throw error;
            }
        }

        // Create bucket
        await client.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`✅ Created bucket: ${bucketName}`);

        // Set public access policy
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: '*',
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        };

        await client.send(
            new PutBucketPolicyCommand({
                Bucket: bucketName,
                Policy: JSON.stringify(policy),
            })
        );

        console.log(`✅ Set public access policy for bucket: ${bucketName}`);
        console.log(`\n🎉 MinIO bucket setup complete!`);
        console.log(`📦 Bucket: ${bucketName}`);
        console.log(`🌐 URL: http://localhost:9000/${bucketName}`);
        console.log(`🖥️  Console: http://localhost:9001`);
        console.log(`👤 Login: minioadmin / minioadmin\n`);

    } catch (error) {
        console.error('❌ Error setting up MinIO bucket:', error);
        process.exit(1);
    }
}

createBucket();
