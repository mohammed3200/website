import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { zValidator } from "@hono/zod-validator";
import { createCreativeRegistrationSchemaServer } from "../schemas";
import { db } from "@/lib/db";

const app = new Hono().post(
  "/",
  zValidator(
    "form",
    createCreativeRegistrationSchemaServer
  ),
  async (c) => {
    const formValid = c.req.valid("form");

    if (!formValid) return c.json({ message: "Invalid form data" }, 400);
    

    const existingUser = await db.innovator.findFirst({
      where: {
        name: formValid.name,
      }
    });

    if (existingUser) return c.json({ message: "User already exists" }, 400);

    const existingEmail = await db.innovator.findFirst({
      where: {
        email: formValid.email,
      }
    });

    if (existingEmail) return c.json({ message: "Email already exists" }, 400);

    const existingPhone = await db.innovator.find({
      where: {
        phone: formValid.phoneNumber,
      }
    });

    if (existingPhone) return c.json({ message: "Phone number already exists" }, 400);

    try {
      const data = {
        id: uuidv4(),
        name: formValid.name,
        email: formValid.email,
        phone: formValid.phoneNumber,
        ProjectTitle: formValid.projectTitle,
        ProjectDescription: formValid.projectDescription || "",
        objective: formValid.objective || "",
        stageDevelopment: formValid.stageDevelopment || "",
      };

      // FIXME: Fix prisma usage problem
      
      console.log("data", data);

      
      return c.json(
        {
          message: "The innovator has been successfully created",
        },
      );
    } catch (error) {
      console.log("Error Creating Innovators:", error);
      return c.json({ message: "Failed to create Innovators" }, 500);
    }
  }
);

export default app;
