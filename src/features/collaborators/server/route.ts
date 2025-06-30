import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidv4 } from "uuid";
import { createJoiningCompaniesCollaboratorSchemaServer } from "../schemas";
import { db } from "@/lib/db";
import { RecordStatus } from "../types";

const app = new Hono()
  // Public endpoint - only approved and visible collaborators
  .get("/public", async (c) => {
    try {
      const collaborators = await db.collaborator.findMany({
        where: {
          status: RecordStatus.APPROVED,
          isVisible: true
        },
        select: {
          id: true,
          companyName: true,
          imageId: true,
          location: true,
          site: true,
          industrialSector: true,
          specialization: true,
        }
      });

      // Collect all image IDs
      const imageIds: string[] = collaborators
        .map(collaborator => collaborator.imageId)
        .filter((id): id is string => !!id);

      // Fetch all related images in bulk
      const images = await db.image.findMany({
        where: { id: { in: imageIds } }
      });

      // Create lookup map for quick access
      const imageMap = new Map(images.map(img => [img.id, img]));

      // Transform the data
      const transformedCollaborators = collaborators.map(collaborator => {
        const image = collaborator.imageId
          ? imageMap.get(collaborator.imageId)
          : null;

        return {
          id: collaborator.id,
          companyName: collaborator.companyName,
          image: image ? {
            data: Buffer.isBuffer(image.data) ? image.data.toString("base64") : "",
            type: image.type,
            size: image.size
          } : null,
          location: collaborator.location,
          site: collaborator.site,
          industrialSector: collaborator.industrialSector,
          specialization: collaborator.specialization
        };
      });

      return c.json({ data: transformedCollaborators }, 200);
    } catch (error) {
      console.error("Error fetching collaborators:", error);
      return c.json(
        {
          code: "SERVER_ERROR",
          message: "Failed to fetch collaborators",
        },
        500
      );
    }
  })
  .post(
    "/",
    zValidator("form", createJoiningCompaniesCollaboratorSchemaServer),
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
        } = c.req.valid("form");

        // Check for existing email
        const existingEmail = await db.collaborator.findFirst({
          where: { email },
        });
        if (existingEmail)
          return c.json({
            code: "EMAIL_EXISTS",
            message: "Email already exists"
          }, 400);

        // Check for existing phone number
        const existingPhone = await db.collaborator.findFirst({
          where: { primaryPhoneNumber },
        });
        if (existingPhone)
          return c.json({
            code: "PHONE_EXISTS",
            message: "Phone number already exists"
          }, 400);

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

        // FIRST: Create the collaborator
        const collaborator = await db.collaborator.create({
          data: {
            id: uuidv4(),
            companyName,
            primaryPhoneNumber,
            optionalPhoneNumber: optionalPhoneNumber || null,
            email: email || null,
            location: location || null,
            site: site || null,
            industrialSector,
            specialization,
            experienceProvided: experienceProvided || null,
            machineryAndEquipment: machineryAndEquipment || null,
            imageId,
          }
        });

        // Create media records helper
        const createMediaRecords = async (files: File[], type: 'experience' | 'machinery') => {
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
                    media: mediaRecord.id,  // Reference media ID
                    collaboratorId: collaborator.id, // Use the created collaborator ID
                  },
                });
              } else {
                return db.machineryAndEquipmentMedia.create({
                  data: {
                    id: uuidv4(),
                    media: mediaRecord.id,  // Reference media ID
                    collaboratorId: collaborator.id, // Use the created collaborator ID
                  },
                });
              }
            })
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

        return c.json({ message: "Collaborator created successfully" }, 201);
      } catch (error) {
        console.error("Error creating collaborator:", error);
        return c.json({
          code: "SERVER_ERROR",
          message: "Failed to create collaborator"
        }, 500);
      }
    }
  );

export default app;