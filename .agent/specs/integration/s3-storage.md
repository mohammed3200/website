# S3 Storage Boundaries

## Setup
Replaced old Prisma DB Blobs to achieve huge financial optimization (free tier R2 or standard AWS). All integrations communicate via `@aws-sdk/client-s3` implementations abstracted locally in `src/lib/storage/s3-service.ts`. 

## Flow & Failsafe rules
1. API router runs basic file constraint bounds (e.g., Limit size to 10MB, strictly filter MIME types to accepted arrays like `mediaTypes.includes(image.type)`).
2. The Node memory buffer receives the file, pushing directly via `Upload` command to S3 instance. Generates UUID keyed identifier string.
3. Successful keys generate `metadata` objects fed downstream into the `Prisma.$transaction` scope.
4. Catch-blocks strictly monitor for DB errors resulting from failed references / timeouts. Overlapping failures trigger `s3Service.deleteFile(s3Key)` ensuring no orphaned blobs remain draining cloud storage limits incorrectly against unregistered database entities.
