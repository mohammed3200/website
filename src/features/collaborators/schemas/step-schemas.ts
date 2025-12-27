import { z } from "zod";
import { ListOfIndustrialSectors } from "../types";
import { mediaTypes } from "@/constants";

/**
 * Step 1: Company Information
 */
export const step1Schema = (t: (key: string) => string) => {
  return z.object({
    companyName: z.string().min(1, { message: t("RequiredField") }),
    image: z
      .union([
        z.instanceof(File),
        z.string().transform((value) => (value === "" ? undefined : value)),
      ])
      .optional(),
    primaryPhoneNumber: z
      .string()
      .min(1, { message: t("RequiredField") })
      .refine(
        (phone) => typeof phone === "string" && /^\+[\d\s-]{6,15}$/.test(phone),
        { message: t("InvalidPhoneNumber") }
      ),
    optionalPhoneNumber: z
      .string()
      .optional()
      .refine((phone) => !phone || /^\+[\d\s-]{6,15}$/.test(phone), {
          message: t("InvalidPhoneNumber"),
      }),
    email: z.string().min(1, { message: t("RequiredField") }).email({ message: t("InvalidEmail") }),
    location: z.string().optional(),
    site: z
      .string()
      .optional()
      .refine(
        (url) =>
          !url ||
          /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(url),
        {
          message: t("InvalidURL"),
        }
      ),
  });
};

/**
 * Step 2: Industry Information
 */
export const step2Schema = (t: (key: string) => string) => {
  return z.object({
    industrialSector: z.nativeEnum(ListOfIndustrialSectors, {
      message: t("RequiredField"),
    }),
    specialization: z.string().min(1, t("RequiredField")),
  });
};

/**
 * Step 3: Company Capabilities
 */
export const step3Schema = (t: (key: string) => string) => {
  return z.object({
    experienceProvided: z.string().optional(),
    experienceProvidedMedia: z
    .custom<File[]>()
      .refine(
        (files) =>
          Array.isArray(files) &&
          (files.length === 0 ||
            files.every((file) => mediaTypes.includes(file.type))),
        {
          message: t("InvalidMediaType"),
        }
      )
      .refine(
        (files) =>
          Array.isArray(files) &&
          (files.length === 0 ||
            files.every((file) => file.size <= 50 * 1024 * 1024)),
        {
          message: t("InvalidFileSize"),
        }
      )
      .optional()
      .default([]),
      
    machineryAndEquipment: z.string().optional(),
    machineryAndEquipmentMedia: z
      .custom<File[]>()
      .refine(
        (files) =>
          Array.isArray(files) &&
          (files.length === 0 ||
            files.every((file) => mediaTypes.includes(file.type))),
        {
          message: t("InvalidMediaType"),
        }
      )
      .refine(
        (files) =>
          Array.isArray(files) &&
          (files.length === 0 ||
            files.every((file) => file.size <= 50 * 1024 * 1024)),
        {
          message: t("InvalidFileSize"),
        }
      )
      .optional()
      .default([]),
  });
};

/**
 * Step 4: Review & Terms
 */
export const step4Schema = (_t: (key: string) => string) => {
  return z.object({
    // TermsOfUse: z.boolean().default(false).refine((value) => value === true, { message: t("TermsOfUse") }),
  });
};

// Merged server-side validation schema
export const completeCollaboratorRegistrationSchema = (t: (key: string) => string) => {
  return step1Schema(t)
    .merge(step2Schema(t))
    .merge(step3Schema(t))
    .merge(step4Schema(t));
};

export const completeCollaboratorRegistrationSchemaServer = z.object({
  // Step 1
  companyName: z.string().min(1, { message: 'RequiredField' }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
  primaryPhoneNumber: z
    .string()
    .min(1, { message: 'RequiredField' })
    .refine(
      (phone) => typeof phone === 'string' && /^\+[\d\s-]{6,15}$/.test(phone),
      { message: 'InvalidPhoneNumber' },
    ),
  optionalPhoneNumber: z
    .string()
    .optional()
    .refine((phone) => !phone || /^\+[\d\s-]{6,15}$/.test(phone), {
      message: 'InvalidPhoneNumber',
    }),
  email: z.string().min(1, { message: 'RequiredField' }).email({
    message: 'InvalidEmail',
  }),
  location: z.string().optional(),
  site: z
    .string()
    .optional()
    .refine(
      (url) =>
        !url ||
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/.test(url),
      {
        message: 'InvalidURL',
      },
    ),

  // Step 2
  industrialSector: z.nativeEnum(ListOfIndustrialSectors, {
    message: 'RequiredField',
  }),
  specialization: z.string().min(1, 'RequiredField'),

  // Step 3
  experienceProvided: z.string().optional(),
  experienceProvidedMedia: z
    .custom<File | File[]>()
    .optional()
    .default([])
    .transform((files) => (Array.isArray(files) ? files : [files]))
    .refine((files) => files.every((file) => mediaTypes.includes(file.type)), {
      message: 'InvalidMediaType',
    })
    .refine((files) => files.every((file) => file.size <= 50 * 1024 * 1024), {
      message: 'InvalidFileSize',
    }),

  machineryAndEquipment: z.string().optional(),
  machineryAndEquipmentMedia: z
    .custom<File | File[]>()
    .optional()
    .default([])
    .transform((files) => (Array.isArray(files) ? files : [files]))
    .refine((files) => files.every((file) => mediaTypes.includes(file.type)), {
      message: 'InvalidMediaType',
    })
    .refine((files) => files.every((file) => file.size <= 50 * 1024 * 1024), {
      message: 'InvalidFileSize',
    }),
});

// Validation schema for status update
export const statusUpdateSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
  nextSteps: z.array(z.string()).optional(),
  locale: z.enum(['ar', 'en']).optional().default('en'),
});