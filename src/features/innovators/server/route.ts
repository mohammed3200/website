import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { completeRegistrationSchema } from "../schemas/step-schemas";
import { RecordStatus, StageDevelopment } from "@prisma/client";
import { s3Service } from "@/lib/storage/s3-service";
import { notifyNewInnovator } from "@/lib/notifications/admin-notifications";

const app = new Hono()
  // Public endpoint - only approved and visible innovators
  .get('/public', async (c) => {
    try {
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
        },
        orderBy: { createdAt: 'desc' },
      });

      // Fetch images for innovators that have them
      const imageIds = innovators
        .map((i: { imageId: string | null }) => i.imageId)
        .filter((id: string | null): id is string => id !== null);

      const images = imageIds.length > 0
        ? await db.image.findMany({
          where: { id: { in: imageIds } },
          select: { id: true, url: true },
        })
        : [];

      const imageMap = new Map(images.map((img: { id: string; url: string | null }) => [img.id, img.url]));

      const transformedInnovators = innovators.map((innovator: typeof innovators[0]) => ({
        id: innovator.id,
        name: innovator.name,
        projectTitle: innovator.projectTitle,
        projectDescription: innovator.projectDescription,
        objective: innovator.objective,
        stageDevelopment: innovator.stageDevelopment,
        imageId: innovator.imageId ? imageMap.get(innovator.imageId) || null : null,
        city: innovator.city,
        country: innovator.country,
      }));

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
    "/",
    zValidator("form", completeRegistrationSchema((key: string) => key)),
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
        projectFiles
      } = c.req.valid("form");

      try {
        // Check for existing email
        const existingEmail = await db.innovator.findFirst({
          where: { email },
        });
        if (existingEmail)
          return c.json({
            code: "EMAIL_EXISTS",
            message: "Email already exists"
          }, 400);

        // Check for existing phone number
        const existingPhone = await db.innovator.findFirst({
          where: { phone: phoneNumber },
        });
        if (existingPhone)
          return c.json({
            code: "PHONE_EXISTS",
            message: "Phone number already exists"
          }, 400);

        // Create image record if image exists (UPDATED - S3 Storage)
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

        const mapStageDevelopment = (stage: string): StageDevelopment => {
          switch (stage) {
            case "STAGE": return StageDevelopment.STAGE;
            case "PROTOTYPE": return StageDevelopment.PROTOTYPE;
            case "DEVELOPMENT": return StageDevelopment.DEVELOPMENT;
            case "TESTING": return StageDevelopment.TESTING;
            case "RELEASED": return StageDevelopment.RELEASED;
            default: return StageDevelopment.STAGE;
          }
        };

        const data = {
          id: uuidv4(),
          name,
          email,
          imageId,
          phone: phoneNumber,
          country,
          city,
          specialization,
          projectTitle,
          projectDescription,
          objective,
          stageDevelopment: mapStageDevelopment(stageDevelopment as string),
        } as {
          id: string,
          name: string,
          email: string,
          imageId?: string,
          phone: string,
          country: string,
          city: string,
          specialization: string,
          projectTitle: string,
          projectDescription: string,
          objective?: string,
          stageDevelopment: StageDevelopment
        };

        const innovator = await db.innovator.create({ data });

        // Process project files if any
        if (projectFiles && Array.isArray(projectFiles) && projectFiles.length > 0) {
          const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          ];

          for (const file of projectFiles) {
            if (!(file instanceof File)) continue;

            // Validate file type
            if (!allowedTypes.includes(file.type)) {
              return c.json({
                code: "INVALID_FILE_TYPE",
                message: `File type ${file.type} is not allowed`
              }, 400);
            }

            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
              return c.json({
                code: "FILE_TOO_LARGE",
                message: `File ${file.name} exceeds 10MB limit`
              }, 400);
            }

            // Store in Media table (UPDATED - S3 Storage)
            const mediaBuffer = Buffer.from(await file.arrayBuffer());
            const mediaKey = s3Service.generateKey('media', file.name, uuidv4());

            const { url, s3Key, bucket } = await s3Service.uploadFile(
              mediaBuffer,
              mediaKey,
              file.type
            );

            const media = await db.media.create({
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

            // Create InnovatorProjectFile record
            await db.innovatorProjectFile.create({
              data: {
                id: uuidv4(),
                innovatorId: innovator.id,
                fileName: file.name,
                fileType: file.type,
                fileSize: file.size,
                mediaId: media.id,
              },
            });
          }
        }

        // Notify admins about new innovator
        try {
          await notifyNewInnovator({
            id: innovator.id,
            name: innovator.name,
            projectTitle: innovator.projectTitle,
            email: innovator.email,
          });
        } catch (notifyError) {
          console.error('Failed to notify admins:', notifyError);
        }

        return c.json({
          message: "The innovator has been successfully created",
        });
      } catch (error) {
        console.error("❌ Error Creating innovators:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          error
        });
        return c.json({
          code: "SERVER_ERROR",
          message: "Failed to create innovators"
        }, 500);
      }
    }
  );

export default app;