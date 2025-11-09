import z from 'zod';
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { zValidator } from '@hono/zod-validator';

import { auth } from '@/auth';
import { db } from '@/lib/db';

import { RecordStatus } from '@/features/collaborators/types';
import {
  createJoiningCompaniesCollaboratorSchemaServer,
  statusUpdateSchema,
} from '@/features/collaborators/schemas';

import { emailService } from '@/lib/email/service'; 

const app = new Hono()
  // Public endpoint - only approved and visible collaborators
  .get('/public', async (c) => {
    try {
      const collaborators = await db.collaborator.findMany({
        where: {
          status: RecordStatus.APPROVED,
          isVisible: true,
        },
        select: {
          id: true,
          companyName: true,
          imageId: true,
          location: true,
          site: true,
          industrialSector: true,
          specialization: true,
        },
      });

      // Collect all image IDs
      const imageIds: string[] = collaborators
        .map((collaborator) => collaborator.imageId)
        .filter((id): id is string => !!id);

      // Fetch all related images in bulk
      const images = await db.image.findMany({
        where: { id: { in: imageIds } },
      });

      // Create lookup map for quick access
      const imageMap = new Map(images.map((img) => [img.id, img]));

      // Transform the data
      const transformedCollaborators = collaborators.map((collaborator) => {
        const image = collaborator.imageId
          ? imageMap.get(collaborator.imageId)
          : null;

        return {
          id: collaborator.id,
          companyName: collaborator.companyName,
          image: image
            ? {
                data: Buffer.isBuffer(image.data)
                  ? image.data.toString('base64')
                  : '',
                type: image.type,
                size: image.size,
              }
            : null,
          location: collaborator.location,
          site: collaborator.site,
          industrialSector: collaborator.industrialSector,
          specialization: collaborator.specialization,
        };
      });

      return c.json({ data: transformedCollaborators }, 200);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      return c.json(
        {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch collaborators',
        },
        500,
      );
    }
  })
  .post(
    '/',
    zValidator('form', createJoiningCompaniesCollaboratorSchemaServer),
    async (c) => {
      try {
        // Destructure form data
        const {
          companyName,
          primaryPhoneNumber,
          optionalPhoneNumber,
          email,
          location,
          site,
          industrialSector,
          specialization,
          experienceProvided,
          machineryAndEquipment,
          image,
          experienceProvidedMedia,
          machineryAndEquipmentMedia,
        } = c.req.valid('form');

        // Check for existing email
        const existingEmail = await db.collaborator.findFirst({
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
        const existingPhone = await db.collaborator.findFirst({
          where: { primaryPhoneNumber },
        });
        if (existingPhone)
          return c.json(
            {
              code: 'PHONE_EXISTS',
              message: 'Phone number already exists',
            },
            400,
          );

        // Create image record if image exists
        let imageId: string | null = null;
        if (image instanceof File) {
          const imageRecord = await db.image.create({
            data: {
              data: Buffer.from(await image.arrayBuffer()),
              type: image.type,
              size: image.size,
            },
          });
          imageId = imageRecord.id;
        }

        
        // Create media records helper
        const createMediaRecords = async (
          files: File[],
          type: 'experience' | 'machinery',
        ) => {
          return Promise.all(
            files.map(async (file) => {
              // Create media record
              const mediaRecord = await db.media.create({
                data: {
                  data: Buffer.from(await file.arrayBuffer()),
                  type: file.type,
                  size: file.size,
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

        // Process experience media AFTER creating collaborator
        if (experienceProvidedMedia.length > 0) {
          await createMediaRecords(experienceProvidedMedia, 'experience');
        }

        // Process machinery media AFTER creating collaborator
        if (machineryAndEquipmentMedia.length > 0) {
          await createMediaRecords(machineryAndEquipmentMedia, 'machinery');
        }

        // FIRST: Create the collaborator
        const collaborator = await db.collaborator.create({
          data: {
            id: uuidv4(),
            companyName,
            primaryPhoneNumber,
            optionalPhoneNumber: optionalPhoneNumber || null,
            email,
            location: location || null,
            site: site || null,
            industrialSector,
            specialization,
            experienceProvided: experienceProvided || null,
            machineryAndEquipment: machineryAndEquipment || null,
            imageId,
          },
        });

        const url = new URL(c.req.url);
        const pathSegments = url.pathname.split('/');
        const lang =
          pathSegments[1] === 'ar' || pathSegments[1] === 'en'
            ? pathSegments[1]
            : 'en';

        // Send confirmation email using new email service
        try {
          const emailResult = await emailService.sendSubmissionConfirmation(
            'collaborator',
            {
              id: collaborator.id,
              companyName: collaborator.companyName,
              email: collaborator.email,
            },
            lang as 'ar' | 'en',
          );

          // FIXME: create table for log email
          if (emailResult.success) {
            console.log('✅ Confirmation email sent successfully:', emailResult.messageId);
          } else {
            console.error('❌ Failed to send confirmation email:', emailResult.error);
          }
        } catch (emailError) {
          // Log email error but don't fail the submission
          console.error('Failed to send confirmation email:', emailError);
        }

        return c.json({ message: 'Collaborator created successfully' }, 201);
      } catch (error) {
        console.error('Error creating collaborator:', error);
        return c.json(
          {
            code: 'SERVER_ERROR',
            message: 'Failed to create collaborator',
          },
          500,
        );
      }
    },
  )
  .patch(
    '/:collaboratorId',
    zValidator('json', statusUpdateSchema),
    async (c) => {
      try {
        const { collaboratorId } = c.req.param();
        const validatedData = c.req.valid('json');

        // Check authentication and authorization
        const session = await auth();

        if (!session?.user) {
          return c.json({ error: 'Unauthorized' }, 401);
        }

        // Check if user has permission to manage collaborators
        const userPermissions = session.user.permissions || [];
        const hasPermission = userPermissions.some(
          (p) =>
            p.resource === 'collaborators' &&
            (p.action === 'update' || p.action === 'manage'),
        );

        if (!hasPermission) {
          return c.json({ error: 'Insufficient permissions' }, 403);
        }

        // Get the collaborator
        const collaborator = await db.collaborator.findUnique({
          where: { id: collaboratorId },
        });

        if (!collaborator) {
          return c.json({ error: 'Collaborator not found' }, 404);
        }

        // Update the collaborator status
        const updatedCollaborator = await db.collaborator.update({
          where: { id: collaboratorId },
          data: {
            status: validatedData.status,
            isVisible: validatedData.status === 'APPROVED',
            updatedAt: new Date(),
          },
        });

        // ✅ Send status update email using new email service
        try {
          const emailResult = await emailService.sendStatusUpdate(
            'collaborator',
            {
              id: collaborator.id,
              companyName: collaborator.companyName,
              email: collaborator.email,
            },
            validatedData.status === 'APPROVED' ? 'approved' : 'rejected',
            {
              reason: validatedData.reason,
              nextSteps: validatedData.nextSteps,
              locale: validatedData.locale,
            },
          );

          if (emailResult.success) {
            console.log('✅ Status update email sent successfully:', emailResult.messageId);
          } else {
            console.error('❌ Failed to send status update email:', emailResult.error);
          }
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
          // Continue even if email fails
        }

        return c.json({
          success: true,
          message: `Collaborator ${validatedData.status.toLowerCase()} successfully`,
          data: {
            id: updatedCollaborator.id,
            companyName: updatedCollaborator.companyName,
            status: updatedCollaborator.status,
            isVisible: updatedCollaborator.isVisible,
          },
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return c.json(
            { error: 'Validation error', details: error.issues },
            400,
          );
        }

        console.error('Status update error:', error);
        return c.json({ error: 'Failed to update collaborator status' }, 500);
      }
    },
  );

export default app;