import { z } from "zod";
import { StageDevelopment } from "../types/types";

/**
 * Step 1: Personal Information
 * Fields: image, name, phoneNumber, email, country, city, specialization
 */
export const step1Schema = (t: (key: string) => string) => z.object({
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
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
});

/**
 * Step 2: Project Overview
 * Fields: projectTitle, projectDescription, objective
 */
export const step2Schema = (t: (key: string) => string) => z.object({
  projectTitle: z.string().min(1, { message: t("RequiredField") }),
  projectDescription: z
    .string()
    .min(1, { message: t("RequiredField") })
    .max(1000, { message: t("MaximumFieldSize") + " 1000" }),
  objective: z.string().optional(),
});

/**
 * Step 3: Project Stage & Files
 * Fields: stageDevelopment, projectFiles
 */
export const step3Schema = (t: (key: string) => string) => z.object({
  stageDevelopment: z.nativeEnum(StageDevelopment).optional(),
  projectFiles: z
    .array(z.instanceof(File))
    .max(10, { message: t("MaximumFiles") })
    .optional()
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        const allowedTypes = [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];
        return files.every((file) => allowedTypes.includes(file.type));
      },
      { message: t("InvalidFileType") }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        const maxSize = 10 * 1024 * 1024; // 10MB
        return files.every((file) => file.size <= maxSize);
      },
      { message: t("FileTooLarge") }
    ),
});

/**
 * Step 4: Review & Submit
 * Fields: TermsOfUse
 */
export const step4Schema = (t: (key: string) => string) => z.object({
  TermsOfUse: z.boolean().refine((value) => value === true, {
    message: t("TermsOfUse"),
  }),
});

/**
 * Combined schema for final submission
 * Merges all step schemas
 */
export const completeRegistrationSchema = (t: (key: string) => string) =>
  step1Schema(t)
    .merge(step2Schema(t))
    .merge(step3Schema(t))
    .merge(step4Schema(t));

// Type exports for TypeScript
export type Step1Data = z.infer<ReturnType<typeof step1Schema>>;
export type Step2Data = z.infer<ReturnType<typeof step2Schema>>;
export type Step3Data = z.infer<ReturnType<typeof step3Schema>>;
export type Step4Data = z.infer<ReturnType<typeof step4Schema>>;
export type CompleteFormData = z.infer<ReturnType<typeof completeRegistrationSchema>>;
