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
        phone: phoneNumber,
        projectTitle,
        projectDescription,
        objective,
        stageDevelopment: mapStageDevelopment(stageDevelopment as string),
      } as {
        id: string,
        name: string,
        email: string,
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