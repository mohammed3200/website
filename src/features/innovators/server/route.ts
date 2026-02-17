import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { NotificationPriority } from '@prisma/client';
import { RecordStatus, StageDevelopment } from '@prisma/client';
import { zValidator } from '@hono/zod-validator';

import { auth } from '@/auth';
import { checkPermission, RESOURCES, ACTIONS } from '@/lib/rbac';
import { statusUpdateSchema } from '../schemas/step-schemas';
import { completeRegistrationSchema } from '../schemas/step-schemas';

import { cache } from '@/lib/cache';
import { db } from '@/lib/db';
import { s3Service } from '@/lib/storage/s3-service';
import { notifyNewInnovator } from '@/lib/notifications/admin-notifications';
import { emailService } from '@/lib/email/service';
import { notifyAdmins } from '@/lib/notifications/admin-notifications';
import { mediaTypes } from '@/constants';

const app = new Hono()
  // Public endpoint - only approved and visible innovators
  .get('/public', async (c) => {
    try {
      const transformedInnovators = await cache.getOrSet(
        'innovators:public',
        async () => {
          const innovators = await db.innovator.findMany({
            where: {
              status: RecordStatus.APPROVED,
              isVisible: true,
            },
            select: {
              id: true,
              name: true,
              projectTitle: true,
              projectDescription: true,
              objective: true,
              stageDevelopment: true,
              imageId: true,
              city: true,
              country: true,
              status: true,
              fieldOfStudy: true,
            },
            orderBy: { createdAt: 'desc' },
          });

          // Fetch images for innovators that have them
          const imageIds = innovators
            .map((i: { imageId: string | null }) => i.imageId)
            .filter((id: string | null): id is string => id !== null);

          const images =
            imageIds.length > 0
              ? await db.image.findMany({
                  where: { id: { in: imageIds } },
                  select: { id: true, url: true },
                })
              : [];

          const imageMap = new Map(
            images.map((img: { id: string; url: string | null }) => [
              img.id,
              img.url,
            ]),
          );

          return innovators.map((innovator: (typeof innovators)[0]) => ({
            id: innovator.id,
            name: innovator.name,
            projectTitle: innovator.projectTitle,
            projectDescription: innovator.projectDescription,
            objective: innovator.objective,
            stageDevelopment: innovator.stageDevelopment,
            status: innovator.status,
            specialization: innovator.fieldOfStudy || '',
            imageUrl: innovator.imageId
              ? imageMap.get(innovator.imageId) || null
              : null,
            imageId: innovator.imageId || null,
            city: innovator.city,
            country: innovator.country,
          }));
        },
        3600, // Cache for 1 hour
      );

      return c.json({ data: transformedInnovators }, 200);
    } catch (error) {
      console.error('Error fetching innovators:', error);
      return c.json(
        { code: 'SERVER_ERROR', message: 'Failed to fetch innovators' },
        500,
      );
    }
  })
  .post(
    '/',
    zValidator(
      'form',
      completeRegistrationSchema((key: string) => key),
    ),
    async (c) => {
      const {
        name,
        email,
        image,
        phoneNumber,
        country,
        city,
        specialization,
        projectTitle,
        projectDescription,
        objective,
        stageDevelopment,
        projectFiles,
      } = c.req.valid('form');

      try {
        // Check for existing email
        const existingEmail = await db.innovator.findFirst({
          where: { email },
        });
        if (existingEmail)
          return c.json(
            {
              code: 'EMAIL_EXISTS',
              message: 'Email already exists',
            },
            400,
          );

        // Check for existing phone number
        const existingPhone = await db.innovator.findFirst({
          where: { phone: phoneNumber },
        });
        if (existingPhone)
          return c.json(
            {
              code: 'PHONE_EXISTS',
              message: 'Phone number already exists',
            },
            400,
          );

        const uploadedS3Keys: string[] = [];

        try {
          // 1. Process files validation
          if (image instanceof File) {
            if (!mediaTypes.includes(image.type)) {
              return c.json(
                {
                  code: 'INVALID_IMAGE_TYPE',
                  message: `Image type ${image.type} is not allowed`,
                },
                400,
              );
            }
            if (image.size > 10 * 1024 * 1024) {
              return c.json(
                {
                  code: 'IMAGE_TOO_LARGE',
                  message: `Image ${image.name} exceeds 10MB limit`,
                },
                400,
              );
            }
          }

          if (projectFiles && Array.isArray(projectFiles)) {
            for (const file of projectFiles) {
              if (!(file instanceof File)) continue;
              if (!mediaTypes.includes(file.type)) {
                return c.json(
                  {
                    code: 'INVALID_FILE_TYPE',
                    message: `File type ${file.type} is not allowed`,
                  },
                  400,
                );
              }
              if (file.size > 10 * 1024 * 1024) {
                return c.json(
                  {
                    code: 'FILE_TOO_LARGE',
                    message: `File ${file.name} exceeds 10MB limit`,
                  },
                  400,
                );
              }
            }
          }

          const mapStageDevelopment = (stage: string): StageDevelopment => {
            switch (stage) {
              case 'STAGE':
                return StageDevelopment.STAGE;
              case 'PROTOTYPE':
                return StageDevelopment.PROTOTYPE;
              case 'DEVELOPMENT':
                return StageDevelopment.DEVELOPMENT;
              case 'TESTING':
                return StageDevelopment.TESTING;
              case 'RELEASED':
                return StageDevelopment.RELEASED;
              default:
                return StageDevelopment.STAGE;
            }
          };

          const data = {
            id: uuidv4(),
            name,
            email,
            phone: phoneNumber,
            country,
            city,
            fieldOfStudy: specialization, // Use fieldOfStudy to match Prisma schema
            projectTitle,
            projectDescription,
            objective,
            stageDevelopment: mapStageDevelopment(stageDevelopment as string),
          };

          // 2. Perform file uploads FIRST (outside transaction)
          let uploadedImageMetadata: any = null;
          const uploadedProjectFilesMetadata: any[] = [];

          if (image instanceof File) {
            const imageBuffer = Buffer.from(await image.arrayBuffer());
            const imageKey = s3Service.generateKey(
              'image',
              image.name,
              uuidv4(),
            );
            const upload = await s3Service.uploadFile(
              imageBuffer,
              imageKey,
              image.type,
            );
            uploadedS3Keys.push(upload.s3Key);
            uploadedImageMetadata = {
              ...upload,
              type: image.type,
              size: image.size,
              originalName: image.name,
              key: imageKey,
            };
          }

          if (projectFiles && Array.isArray(projectFiles)) {
            for (const file of projectFiles) {
              if (!(file instanceof File)) continue;
              const mediaBuffer = Buffer.from(await file.arrayBuffer());
              const mediaKey = s3Service.generateKey(
                'media',
                file.name,
                uuidv4(),
              );
              const upload = await s3Service.uploadFile(
                mediaBuffer,
                mediaKey,
                file.type,
              );
              uploadedS3Keys.push(upload.s3Key);
              uploadedProjectFilesMetadata.push({
                ...upload,
                type: file.type,
                size: file.size,
                originalName: file.name,
                key: mediaKey,
              });
            }
          }

          // 3. Perform DB writes in a short transaction
          const result = await db.$transaction(async (tx) => {
            let imageId: string | null = null;

            if (uploadedImageMetadata) {
              const imageRecord = await tx.image.create({
                data: {
                  url: uploadedImageMetadata.url,
                  s3Key: uploadedImageMetadata.s3Key,
                  s3Bucket: uploadedImageMetadata.s3Bucket,
                  mimeType: uploadedImageMetadata.type,
                  size: uploadedImageMetadata.size,
                  originalName: uploadedImageMetadata.originalName,
                  filename: uploadedImageMetadata.key,
                },
              });
              imageId = imageRecord.id;
            }

            const innovator = await tx.innovator.create({
              data: {
                ...data,
                imageId,
              },
            });

            for (const meta of uploadedProjectFilesMetadata) {
              const media = await tx.media.create({
                data: {
                  url: meta.url,
                  s3Key: meta.s3Key,
                  s3Bucket: meta.s3Bucket,
                  mimeType: meta.type,
                  size: meta.size,
                  originalName: meta.originalName,
                  filename: meta.key,
                },
              });

              await tx.innovatorProjectFile.create({
                data: {
                  id: uuidv4(),
                  innovatorId: innovator.id,
                  fileName: meta.originalName,
                  fileType: meta.type,
                  fileSize: meta.size,
                  mediaId: media.id,
                },
              });
            }

            return innovator;
          });

          // Notify admins about new innovator
          try {
            await notifyNewInnovator({
              id: result.id,
              name: result.name,
              projectTitle: result.projectTitle,
              email: result.email,
            });
          } catch (notifyError) {
            console.error('Failed to notify admins:', notifyError);
          }

          return c.json(
            {
              message: 'The innovator has been successfully created',
            },
            201,
          );
        } catch (error) {
          // CLEANUP: If anything fails, delete all uploaded S3 files
          await Promise.allSettled(
            uploadedS3Keys.map((key) => s3Service.deleteFile(key)),
          );

          throw error; // Rethrow to let Hono handle 500
        }
      } catch (error) {
        console.error('❌ Error Creating innovators:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          error,
        });
        return c.json(
          {
            code: 'SERVER_ERROR',
            message: 'Failed to create innovators',
          },
          500,
        );
      }
    },
  )
  .patch('/:innovatorId', zValidator('json', statusUpdateSchema), async (c) => {
    try {
      const { innovatorId } = c.req.param();
      const validatedData = c.req.valid('json');

      // Check authentication and authorization
      const session = await auth();

      if (!session?.user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      // Check permission using RBAC helper
      const hasPermission = checkPermission(
        session.user.permissions,
        RESOURCES.INNOVATORS,
        ACTIONS.UPDATE,
      );

      if (!hasPermission) {
        return c.json({ error: 'Insufficient permissions' }, 403);
      }

      // Get the innovator
      const innovator = await db.innovator.findUnique({
        where: { id: innovatorId },
      });

      if (!innovator) {
        return c.json({ error: 'Innovator not found' }, 404);
      }

      // Update the innovator status
      const updatedInnovator = await db.innovator.update({
        where: { id: innovatorId },
        data: {
          status: validatedData.status,
          isVisible: validatedData.status === 'APPROVED',
          updatedAt: new Date(),
        },
      });

      // Notify admins and send email about status update
      if (
        validatedData.status === 'APPROVED' ||
        validatedData.status === 'REJECTED'
      ) {
        // 1. Notify Admins
        try {
          await notifyAdmins({
            type:
              validatedData.status === 'APPROVED'
                ? 'SUBMISSION_APPROVED'
                : 'SUBMISSION_REJECTED',
            title: `Innovator ${validatedData.status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
            message: `Innovator "${innovator.name}" has been ${validatedData.status.toLowerCase()}.`,
            actionUrl: `/admin/innovators?id=${innovator.id}`,
            priority: NotificationPriority.NORMAL,
            requiredPermission: 'innovators:manage',
            data: {
              innovatorId: innovator.id,
              status: validatedData.status,
              reason: validatedData.reason,
            },
          });
        } catch (notifyError) {
          console.error(
            'Failed to notify admins about status update:',
            notifyError,
          );
        }

        // 2. Send status update email
        try {
          const emailResult = await emailService.sendStatusUpdate(
            'innovator',
            {
              id: innovator.id,
              name: innovator.name,
              email: innovator.email,
            },
            validatedData.status === 'APPROVED' ? 'approved' : 'rejected',
            {
              reason: validatedData.reason,
              nextSteps: validatedData.nextSteps,
              locale: validatedData.locale,
            },
          );

          if (!emailResult.success) {
            console.error(
              '❌ Failed to send status update email:',
              emailResult.error,
            );
          }
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
        }
      }

      // Invalidate public cache
      await cache.del('innovators:public');

      return c.json({
        success: true,
        message: `Innovator ${validatedData.status.toLowerCase()} successfully`,
        data: {
          id: updatedInnovator.id,
          name: updatedInnovator.name,
          status: updatedInnovator.status,
          isVisible: updatedInnovator.isVisible,
        },
      });
    } catch (error) {
      console.error('Status update error:', error);
      return c.json({ error: 'Failed to update innovator status' }, 500);
    }
  })
  .delete('/:innovatorId', async (c) => {
    try {
      const { innovatorId } = c.req.param();

      // Check authentication and authorization
      const session = await auth();

      if (!session?.user) {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      // Check permission using RBAC helper
      const hasPermission = checkPermission(
        session.user.permissions,
        RESOURCES.INNOVATORS,
        ACTIONS.DELETE,
      );

      if (!hasPermission) {
        return c.json({ error: 'Insufficient permissions' }, 403);
      }

      // Get the innovator with all relations for cleanup
      const innovator = await db.innovator.findUnique({
        where: { id: innovatorId },
        include: {
          image: true,
          projectFiles: {
            include: {
              media: true,
            },
          },
        },
      });

      if (!innovator) {
        return c.json({ error: 'Innovator not found' }, 404);
      }

      // Collect all S3 keys to delete
      const s3KeysToDelete: string[] = [];
      if (innovator.image?.s3Key) {
        s3KeysToDelete.push(innovator.image.s3Key);
      }

      innovator.projectFiles.forEach((f) => {
        if (f.media.s3Key) {
          s3KeysToDelete.push(f.media.s3Key);
        }
      });

      // 1. Delete from DB in transaction FIRST
      await db.$transaction(async (tx) => {
        // Collect media record IDs
        const mediaRecordIds = innovator.projectFiles.map((f) => f.mediaId);

        // Delete project files relations
        await tx.innovatorProjectFile.deleteMany({
          where: { innovatorId: innovator.id },
        });

        // Delete Media records
        if (mediaRecordIds.length > 0) {
          await tx.media.deleteMany({
            where: { id: { in: mediaRecordIds } },
          });
        }

        // Delete the Innovator FIRST (or nullify imageId if needed, but since we delete the image too, deleting innovator first is safer if restriction is on innovator)
        // Actually, if Innovator has a FK to Image (imageId), we should delete Innovator first if it's set to RESTRICT.
        await tx.innovator.delete({
          where: { id: innovator.id },
        });

        // Delete the Image record if it exists
        if (innovator.imageId) {
          await tx.image.delete({
            where: { id: innovator.imageId },
          });
        }
      });

      // 2. ONLY if DB transaction succeeds, Delete files from S3
      const deletionResults = await Promise.allSettled(
        s3KeysToDelete.map((key) => s3Service.deleteFile(key)),
      );

      // Log any failures in S3 deletion
      deletionResults.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(
            `❌ Failed to delete S3 object: ${s3KeysToDelete[index]}`,
            result.reason,
          );
        }
      });

      // Invalidate public cache
      await cache.del('innovators:public');

      return c.json(
        {
          success: true,
          message: 'Innovator and associated media deleted successfully',
        },
        200,
      );
    } catch (error) {
      console.error('Error deleting innovator:', error);
      return c.json({ error: 'Failed to delete innovator' }, 500);
    }
  });

export default app;
