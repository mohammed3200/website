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
    country: z.string().min(1, { message: t("RequiredField") }),
    city: z
      .string()
      .min(1, { message: t("RequiredField") })
      .max(100, { message: t("CityTooLong") }),
    specialization: z
      .string()
      .min(1, { message: t("RequiredField") })
      .max(200, { message: t("SpecializationTooLong") }),
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

    // ======= Project Files =======
    projectFiles: z
      .array(z.instanceof(File))
      .min(0)
      .max(10, { message: t("MaximumFiles") })
      .refine(
        (files) => {
          const maxSize = 10 * 1024 * 1024; // 10MB per file
          return files.every(file => file.size <= maxSize);
        },
        { message: t("FileTooLarge") }
      )
      .refine(
        (files) => {
          const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          ];
          return files.every(file => allowedTypes.includes(file.type));
        },
        { message: t("InvalidFileType") }
      )
      .optional(),

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
  country: z.string().min(1, { message: "RequiredField" }),
  city: z
    .string()
    .min(1, { message: "RequiredField" })
    .max(100, { message: "CityTooLong" }),
  specialization: z
    .string()
    .min(1, { message: "RequiredField" })
    .max(200, { message: "SpecializationTooLong" }),
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

  // ======= Project Files =======
  projectFiles: z
    .array(z.instanceof(File))
    .min(0)
    .max(10, { message: "MaximumFiles" })
    .refine(
      (files) => {
        const maxSize = 10 * 1024 * 1024; // 10MB per file
        return files.every(file => file.size <= maxSize);
      },
      { message: "FileTooLarge" }
    )
    .refine(
      (files) => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/webp',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        return files.every(file => allowedTypes.includes(file.type));
      },
      { message: "InvalidFileType" }
    )
    .optional(),

  // ======== Center Policies ========
  TermsOfUse: z.coerce
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "TermsOfUse",
    }),
}).strict();
