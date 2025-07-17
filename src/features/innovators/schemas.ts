import { z } from "zod";
import { StageDevelopment } from "./types";

// TODO: Remove Terms of user 
export const createCreativeRegistrationSchema = (
  t: (key: string) => string
) => {
  return z.object({
    // ====== Basic information ======
    name: z.string().min(1, { message: t("RequiredField") }),
    phoneNumber: z
      .string()
      .min(1, { message: t("RequiredField") })
      .refine(
        (phone) => typeof phone === "string" && /^\+[\d\s-]{6,15}$/.test(phone),
        { message: t("InvalidPhoneNumber") }
      ),
    email: z
      .string()
      .min(1, { message: t("RequiredField") })
      .email({
        message: t("InvalidEmail"),
      }),
    image: z
      .union([
        z.instanceof(File),
        z.string().transform((value) => (value === "" ? undefined : value)),
      ])
      .optional(),

    // ======= Project Details ======
    projectTitle: z.string().min(1, { message: t("RequiredField") }),
    projectDescription: z
      .string()
      .min(1, { message: t("RequiredField") })
      .max(1000, { message: `${t("MaximumFieldSize")} 1000` }),
    objective: z.string().optional(),
    stageDevelopment: z.nativeEnum(StageDevelopment).optional(),

    // ======== Center Policies ========
    TermsOfUse: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
        message: t("TermsOfUse"),
      }),
  });
};

export const createCreativeRegistrationSchemaServer = z.object({
  // ====== Basic information ======
  name: z.string().min(1, { message: "RequiredField" }),
  phoneNumber: z
    .string()
    .min(1, { message: "RequiredField" })
    .refine(
      (phone) => typeof phone === "string" && /^\+[\d\s-]{6,15}$/.test(phone),
      { message: "InvalidPhoneNumber" }
    ),
  email: z
    .string()
    .min(1, { message: "RequiredField" })
    .email({
      message: "InvalidEmail",
    }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),

  // ======= Project Details ======
  projectTitle: z.string().min(1, { message: "RequiredField" }),
  projectDescription: z
    .string()
    .min(1, { message: "RequiredField" })
    .max(1000, { message: "MaximumFieldSize 1000" }),
  objective: z.string().optional(),
  stageDevelopment: z.nativeEnum(StageDevelopment).optional(),

  // ======== Center Policies ========
  TermsOfUse: z.coerce
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "TermsOfUse",
    }),
}).strict();
