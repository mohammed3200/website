import { Worker, Job } from 'bullmq';
import { redis } from '@/lib/redis';
import { db } from '@/lib/db';
import { REPORT_QUEUE_NAME } from './report-queue';

export const reportWorker = new Worker(
    REPORT_QUEUE_NAME,
    async (job: Job) => {
        const { reportId, name, type, format } = job.data;

        console.log(`Processing report job ${job.id} for report ${reportId}`);

        try {
            // Update status to GENERATING
            await db.report.update({
                where: { id: reportId },
                data: { status: 'GENERATING' },
            });

            // Simulation of report generation (e.g., CSV generation and S3 upload)
            // In a real implementation, you would:
            // 1. Fetch data based on type (Innovators, Collaborators, etc.)
            // 2. Generate file content (CSV/PDF)
            // 3. Upload to S3/MinIO
            // 4. Get the public/presigned URL

            await new Promise((resolve) => setTimeout(resolve, 5000)); // Simulate work

            const mockFileUrl = `/api/admin/reports/download/${reportId}`;

            // Update status to COMPLETED
            await db.report.update({
                where: { id: reportId },
                data: {
                    status: 'COMPLETED',
                    generatedAt: new Date(),
                    fileUrl: mockFileUrl,
                },
            });

            console.log(`Report job ${job.id} completed successfully`);
        } catch (error) {
            console.error(`Report job ${job.id} failed:`, error);

            await db.report.update({
                where: { id: reportId },
                data: { status: 'FAILED' },
            });

            throw error; // Let BullMQ handle retries
        }
    },
    { connection: redis }
);

reportWorker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed!`);
});

reportWorker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
});
