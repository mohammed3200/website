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
      if (existingEmail) return c.json({ message: "Email already exists" }, 400);

      // Check for existing phone number
      const existingPhone = await db.collaborator.findFirst({
        where: { primaryPhoneNumber },
      });
      if (existingPhone) return c.json({ message: "Phone number already exists" }, 400);

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

      // Prepare media data
      const createMediaRecords = async (files: File[]) => {
        return Promise.all(
          files.map(async (file) => {
            return {
              id: uuidv4(),
              media: file.name, // Store filename instead of binary
            };
          })
        );
      };

      // Process experience media
      const experienceFiles = Array.isArray(experienceProvidedMedia)
        ? experienceProvidedMedia
        : [];
      const experienceMedia = experienceFiles.length > 0
        ? await createMediaRecords(experienceFiles)
        : [];

      // Process machinery media
      const machineryFiles = Array.isArray(machineryAndEquipmentMedia)
        ? machineryAndEquipmentMedia
        : [];
      const machineryMedia = machineryFiles.length > 0
        ? await createMediaRecords(machineryFiles)
        : [];

      // Prepare collaborator data
      const data = {
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
        experienceProvidedMedia: experienceMedia.length > 0
          ? { create: experienceMedia }
          : undefined,
        machineryAndEquipmentMedia: machineryMedia.length > 0
          ? { create: machineryMedia }
          : undefined,
      };

      // Create collaborator with nested media records
      await db.collaborator.create({ data });

      return c.json({ message: "Collaborator created successfully" }, 201);
    } catch (error) {
      console.error("Error creating collaborator:", error);
      return c.json({ message: "Failed to create collaborator" }, 500);
    }
  }
);

export default app;