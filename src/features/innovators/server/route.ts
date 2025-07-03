import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { createCreativeRegistrationSchemaServer } from "../schemas";
import { StageDevelopment } from "@prisma/client";

const app = new Hono().post(
  "/",
  zValidator("form", createCreativeRegistrationSchemaServer),
  async (c) => {
    const {
      name,
      email,
      image,
      phoneNumber,
      projectTitle,
      projectDescription,
      objective,
      stageDevelopment
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
        projectTitle: string,
        projectDescription: string,
        objective?: string,
        stageDevelopment: StageDevelopment
      };

      await db.innovator.create({ data });

      return c.json({
        message: "The innovator has been successfully created",
      });
    } catch (error) {
      console.log("Error Creating innovators:", error);
      return c.json({
        code: "SERVER_ERROR",
        message: "Failed to create innovators"
      }, 500);
    }
  }
);

export default app;