import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidv4 } from "uuid";
import { createJoiningCompaniesCollaboratorSchemaServer } from "../schemas";
import { db } from "@/lib/db";

const app = new Hono().post(
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
        return c.json({ message: "Email already exists" }, 400);

      // Check for existing phone number
      const existingPhone = await db.collaborator.findFirst({
        where: { primaryPhoneNumber },
      });
      if (existingPhone)
        return c.json({ message: "Phone number already exists" }, 400);

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

      // Create collaborator first to get ID for media relations
      const collaboratorId = uuidv4();
      const collaboratorData = {
        id: collaboratorId,
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
      };

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
                  collaboratorId,
                },
              });
            } else {
              return db.machineryAndEquipmentMedia.create({
                data: {
                  id: uuidv4(),
                  media: mediaRecord.id,  // Reference media ID
                  collaboratorId,
                },
              });
            }
          })
        );
      };

      // Process experience media
      if (experienceProvidedMedia.length > 0) {
        await createMediaRecords(experienceProvidedMedia, 'experience');
      }

      // Process machinery media
      if (machineryAndEquipmentMedia.length > 0) {
        await createMediaRecords(machineryAndEquipmentMedia, 'machinery');
      }

      // Create collaborator
      await db.collaborator.create({
        data: collaboratorData
      });

      return c.json({ message: "Collaborator created successfully" }, 201);
    } catch (error) {
      console.error("Error creating collaborator:", error);
      return c.json({ message: "Failed to create collaborator" }, 500);
    }
  }
);

export default app;