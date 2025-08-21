import { z } from 'zod';
import { ListOfIndustrialSectors } from './types';
import { mediaTypes } from '@/constants';

export const createJoiningCompaniesCollaboratorSchema = (
  t: (key: string) => string,
) => {
  return z.object({
    // ====== Basic information ======
    companyName: z.string().min(1, { message: t('RequiredField') }),
    primaryPhoneNumber: z
      .string()
      .min(1, { message: t('RequiredField') })
      .refine(
        (phone) => typeof phone === 'string' && /^\+[\d\s-]{6,15}$/.test(phone),
        { message: t('InvalidPhoneNumber') },
      ),
    optionalPhoneNumber: z
      .string()
      .optional()
      .refine((phone) => !phone || /^\+[\d\s-]{6,15}$/.test(phone), {
        message: t('InvalidPhoneNumber'),
      }),
    email: z
      .string()
      .min(1, { message: t('RequiredField') })
      .email({
        message: t('InvalidEmail'),
      }),
    image: z
      .union([
        z.instanceof(File),
        z.string().transform((value) => (value === '' ? undefined : value)),
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
          message: t('InvalidURL'),
        },
      ),
    location: z.string().optional(),

    // ====== Industrial Information ======
    industrialSector: z.nativeEnum(ListOfIndustrialSectors, {
      message: t('RequiredField'),
    }),
    specialization: z.string().min(1, t('RequiredField')),

    // ======= Shared Resources =======
    experienceProvided: z.string().optional(),
    experienceProvidedMedia: z
      .custom<File[]>()
      .refine(
        (files) =>
          Array.isArray(files) &&
          (files.length === 0 ||
            files.every((file) => mediaTypes.includes(file.type))),
        {
          message: t('InvalidMediaType'),
        },
      )
      .refine(
        (files) =>
          Array.isArray(files) &&
          (files.length === 0 ||
            files.every((file) => file.size <= 50 * 1024 * 1024)),
        {
          message: t('InvalidFileSize'),
        },
      )
      .optional()
      .default([]), // Default to an empty array if no files are provided

    machineryAndEquipment: z.string().optional(),
    machineryAndEquipmentMedia: z
      .custom<File[]>()
      .refine(
        (files) =>
          Array.isArray(files) &&
          (files.length === 0 ||
            files.every((file) => mediaTypes.includes(file.type))),
        {
          message: t('InvalidMediaType'),
        },
      )
      .refine(
        (files) =>
          Array.isArray(files) &&
          (files.length === 0 ||
            files.every((file) => file.size <= 50 * 1024 * 1024)),
        {
          message: t('InvalidFileSize'),
        },
      )
      .optional()
      .default([]), // Default to an empty array if no files are provided

    // ======== Center Policies ========
    // TermsOfUse: z
    //   .boolean()
    //   .default(false)
    //   .refine((value) => value === true, {
    //     message: t("TermsOfUse"),
    //   }),
  });
};

export const createJoiningCompaniesCollaboratorSchemaServer = z.object({
  // ====== Basic information ======
  companyName: z.string().min(1, { message: 'RequiredField' }),
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
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
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
        message: 'InvalidURL',
      },
    ),
  location: z.string().optional(),

  // ====== Industrial Information ======
  industrialSector: z.nativeEnum(ListOfIndustrialSectors, {
    message: 'RequiredField',
  }),
  specialization: z.string().min(1, 'RequiredField'),

  // ======= Shared Resources =======
  experienceProvided: z.string().optional(),
  experienceProvidedMedia: z
    .custom<File | File[]>() // Accept single File or array
    .optional()
    .default([])
    .transform((files) => (Array.isArray(files) ? files : [files])) // Ensure array
    .refine((files) => files.every((file) => mediaTypes.includes(file.type)), {
      message: 'InvalidMediaType',
    })
    .refine((files) => files.every((file) => file.size <= 50 * 1024 * 1024), {
      message: 'InvalidFileSize',
    }),

  machineryAndEquipment: z.string().optional(),
  machineryAndEquipmentMedia: z
    .custom<File | File[]>() // Accept single File or array
    .optional()
    .default([])
    .transform((files) => (Array.isArray(files) ? files : [files])) // Ensure array
    .refine((files) => files.every((file) => mediaTypes.includes(file.type)), {
      message: 'InvalidMediaType',
    })
    .refine((files) => files.every((file) => file.size <= 50 * 1024 * 1024), {
      message: 'InvalidFileSize',
    }),

  // ======== Center Policies ========
  // TermsOfUse: z
  //   .string()
  //   .default("false")
  //   .refine((value) => value === "true", {
  //     message: "TermsOfUse",
  //   }),
});
