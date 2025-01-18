import { z } from "zod";
import { ListOfIndustrialSectors } from "./types";
import { mediaTypes } from "@/constants";

export const createJoiningCompaniesCollaboratorSchema = (
  t: (key: string) => string
) => {
  return z.object({
    // ====== Basic information ======
    companyName: z.string().min(1, { message: t("RequiredField") }),
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
    email: z
      .string()
      .optional()
      .refine(
        (email) =>
          !email ||
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
        {
          message: t("InvalidEmail"),
        }
      ),
    image: z
      .union([
        z.instanceof(File),
        z.string().transform((value) => (value === "" ? undefined : value)),
      ])
      .optional(),
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
    location: z.string().optional(),

    // ====== Industrial Information ======
    industrialSector: z.nativeEnum(ListOfIndustrialSectors, {
      required_error: t("RequiredField"),
    }),
    specialization: z.string().min(1, t("RequiredField")),

    // ======= Shared Resources =======
    experienceProvided: z.string().optional(),
    experienceProvidedMedia: z.custom<File[]>()
    .refine(
      (files) => Array.isArray(files) && (files.length === 0 || files.every((file) => mediaTypes.includes(file.type))),
      {
        message: t("InvalidMediaType"),
      }
    )
    .refine(
      (files) => Array.isArray(files) && (files.length === 0 || files.every((file) => file.size <= 50 * 1024 * 1024)),
      {
        message: t("InvalidFileSize"),
      }
    )
    .optional()
    .default([]), // Default to an empty array if no files are provided

    machineryAndEquipment: z.string().optional(),
    machineryAndEquipmentMedia: z.custom<File[]>()
  .refine(
    (files) => Array.isArray(files) && (files.length === 0 || files.every((file) => mediaTypes.includes(file.type))),
    {
      message: t("InvalidMediaType"),
    }
  )
  .refine(
    (files) => Array.isArray(files) && (files.length === 0 || files.every((file) => file.size <= 50 * 1024 * 1024)),
    {
      message: t("InvalidFileSize"),
    }
  )
  .optional()
  .default([]), // Default to an empty array if no files are provided

    // ======== Center Policies ========
    TermsOfUse: z
      .boolean()
      .default(false)
      .refine((value) => value === true, {
        message: t("TermsOfUse"),
      }),
  });
};
