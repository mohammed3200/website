import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidv4 } from "uuid";
import { createJoiningCompaniesCollaboratorSchemaServer } from "../schemas";
import prisma from "@/lib/client";

const app = new Hono().post(
  "/",
  zValidator("form", createJoiningCompaniesCollaboratorSchemaServer),
  async (c) => {
    const formValid = c.req.valid("form");
    console.log("form valid", formValid);

    try {
      // Ensure machineryAndEquipmentMedia is an array
      const machineryAndEquipmentMedia = Array.isArray(
        formValid.machineryAndEquipmentMedia
      )
        ? formValid.machineryAndEquipmentMedia
        : [];

      // Ensure experienceProvidedMedia is an array
      const experienceProvidedMedia = Array.isArray(
        formValid.experienceProvidedMedia
      )
        ? formValid.experienceProvidedMedia
        : [];

      const data = {
        id: uuidv4(),
        companyName: formValid.companyName,
        primaryPhoneNumber: formValid.primaryPhoneNumber,
        optionalPhoneNumber: formValid.optionalPhoneNumber || "",
        email: formValid.email || "",
        location: formValid.location || "",
        site: formValid.site || "",
        industrialSector: formValid.industrialSector,
        specialization: formValid.specialization,
        experienceProvided: formValid.experienceProvided || "",
        machineryAndEquipment: formValid.machineryAndEquipment || "",
        image: formValid.image
          ? {
              create: {
                data: Buffer.from(
                  await (formValid.image as File).arrayBuffer()
                ),
              },
            }
          : undefined,
        experienceProvidedMedia:
          experienceProvidedMedia.length > 0
            ? {
                create: await Promise.all(
                  experienceProvidedMedia.map(async (file) => {
                    if (file instanceof File) {
                      return {
                        data: Buffer.from(await file.arrayBuffer()),
                        type: file.type,
                      };
                    } else {
                      throw new Error(
                        "Invalid file type in experienceProvidedMedia"
                      );
                    }
                  })
                ),
              }
            : undefined,
        machineryAndEquipmentMedia:
          machineryAndEquipmentMedia.length > 0
            ? {
                create: await Promise.all(
                  machineryAndEquipmentMedia.map(async (file) => {
                    if (file instanceof File) {
                      return {
                        data: Buffer.from(await file.arrayBuffer()),
                        type: file.type,
                      };
                    } else {
                      throw new Error(
                        "Invalid file type in machineryAndEquipmentMedia"
                      );
                    }
                  })
                ),
              }
            : undefined,
      };

      console.log({ data });

      // Create the collaborator in the database
      const collaborator = await prisma.collaborator.create({
        data,
      });

      return c.json({
        message: "Collaborator created successfully",
        collaborator,
      });

    } catch (error) {
      console.error("Error creating collaborator:", error);
      return c.json({ message: "Failed to create collaborator" }, 500);
    }
  }
);

export default app;