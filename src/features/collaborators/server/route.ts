/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuidv4 } from "uuid";
import { createJoiningCompaniesCollaboratorSchema } from "../schemas";

const app = new Hono().post(
  "/",
  zValidator(
    "form",
    createJoiningCompaniesCollaboratorSchema((t) => t)
  ),
  async (c) => {
    const formData = await c.req.formData();

    console.log("Received Form Data:", formData); // Log form data for debugging
    // const formValid = await c.req.valid("form");
    // console.log("form valid" ,formValid);

    try {
      const data = {
        id: uuidv4(),
        companyName: formData.get("companyName") as string,
        primaryPhoneNumber: formData.get("primaryPhoneNumber") as string,
        optionalPhoneNumber: formData.get("optionalPhoneNumber") as string,
        email: formData.get("email") as string,
        location: formData.get("location") as string,
        site: formData.get("site") as string,
        industrialSector: formData.get("industrialSector") as string,
        specialization: formData.get("specialization") as string,
        experienceProvided: formData.get("experienceProvided") as string,
        machineryAndEquipment: formData.get("machineryAndEquipment") as string,
        TermsOfUse: formData.get("TermsOfUse") === "true",
        image: formData.get("image")
          ? {
              create: {
                data: Buffer.from(
                  await (formData.get("image") as File).arrayBuffer()
                ),
              },
            }
          : undefined,
        experienceProvidedMedia: formData.getAll("experienceProvidedMedia")
          ? {
              create: await Promise.all(
                (formData.getAll("experienceProvidedMedia") as File[]).map(
                  async (file) => ({
                    data: Buffer.from(await file.arrayBuffer()),
                    type: file.type,
                  })
                )
              ),
            }
          : undefined,
        machineryAndEquipmentMedia: formData.getAll(
          "machineryAndEquipmentMedia"
        )
          ? {
              create: await Promise.all(
                (formData.getAll("machineryAndEquipmentMedia") as File[]).map(
                  async (file) => ({
                    data: Buffer.from(await file.arrayBuffer()),
                    type: file.type,
                  })
                )
              ),
            }
          : undefined,
      };
      // console.log("server : ",  data );
      console.log({ data });

      return c.json(
        {
          message: "Collaborator created successfully",
        },
        201
      );
    } catch (error) {
      console.error("Error creating collaborator:", error);
      return c.json({ message: "Failed to create collaborator" }, 500);
    }
  }
);

export default app;
