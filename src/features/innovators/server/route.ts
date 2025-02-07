import { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";
import { zValidator } from "@hono/zod-validator";
import { createCreativeRegistrationSchemaServer } from "../schemas";

const app = new Hono().post(
  "/",
  zValidator(
    "form",
    createCreativeRegistrationSchemaServer
  ),
  async (c) => {
    const formValid = c.req.valid("form");

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
