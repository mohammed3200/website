import { z } from 'zod';
import { StageDevelopment } from '../types/types';
import { mediaTypes } from '@/constants';

/**
 * Step 1: Personal Information
 * Fields: image, name, phoneNumber, email, country, city, specialization
 *
 * IMPORTANT: Required fields must NOT use .optional().
 * The store initializes with {}, so undefined fields must fail validation.
 * Zod v4 uses { error: string } instead of { required_error: string }.
 */
export const step1Schema = (t: (key: string) => string) =>
  z.object({
    image: z
      .union([
        z.instanceof(File),
        z.string().transform((value) => (value === '' ? undefined : value)),
      ])
      .optional(),
    name: z
      .string({ error: t('nameRequired') })
      .min(1, { message: t('nameRequired') }),
    phoneNumber: z
      .string({ error: t('phoneRequired') })
      .min(1, { message: t('phoneRequired') })
      .refine(
        (phone) => /^\+[\d\s-]{6,15}$/.test(phone),
        { message: t('InvalidPhoneNumber') },
      ),
    email: z
      .string({ error: t('emailRequired') })
      .min(1, { message: t('emailRequired') })
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: t('InvalidEmail'),
      }),
    country: z
      .string({ error: t('countryRequired') })
      .min(1, { message: t('countryRequired') }),
    city: z
      .string({ error: t('cityRequired') })
      .min(1, { message: t('cityRequired') })
      .max(100, { message: t('CityTooLong') }),
    specialization: z
      .string({ error: t('specializationRequired') })
      .min(1, { message: t('specializationRequired') })
      .max(200, { message: t('SpecializationTooLong') }),
  });

/**
 * Server-side schema for innovators (without translation functions)
 * Uses strict validation with defaults for required fields
 */
export const innovatorServerSchema = z.object({
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === '' ? undefined : value)),
    ])
    .optional(),
  name: z.string().min(1, { message: 'RequiredField' }).default(''),
  phoneNumber: z
    .string()
    .min(1, { message: 'RequiredField' })
    .refine(
      (phone) => typeof phone === 'string' && /^\+[\d\s-]{6,15}$/.test(phone),
      { message: 'InvalidPhoneNumber' },
    )
    .default(''),
  email: z
    .string()
    .min(1, { message: 'RequiredField' })
    .email({ message: 'InvalidEmail' })
    .default(''),
  country: z.string().min(1, { message: 'RequiredField' }).default(''),
  city: z
    .string()
    .min(1, { message: 'RequiredField' })
    .max(100, { message: 'CityTooLong' })
    .default(''),
  specialization: z
    .string()
    .min(1, { message: 'RequiredField' })
    .max(200, { message: 'SpecializationTooLong' })
    .default(''),

  // Step 2
  projectTitle: z.string().min(1, { message: 'RequiredField' }).default(''),
  projectDescription: z
    .string()
    .min(1, { message: 'RequiredField' })
    .max(1000, { message: 'MaximumFieldSize' })
    .default(''),
  objective: z.string().optional(),

  // Step 3
  stageDevelopment: z.nativeEnum(StageDevelopment).optional(),
  projectFiles: z
    .custom<File | File[]>()
    .optional()
    .default([])
    .transform((files) => (Array.isArray(files) ? files : [files]))
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        return files.every((file) => file instanceof File && mediaTypes.includes(file.type));
      },
      { message: 'InvalidFileType' },
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true;
        const maxSize = 10 * 1024 * 1024; // 10MB
        return files.every((file) => file instanceof File && file.size <= maxSize);
      },
      { message: 'FileTooLarge' },
    ),

  // Step 4
  TermsOfUse: z
    .preprocess(
      (val) => val === 'true' || val === true,
      z.boolean()
    )
    .refine((value) => value === true, { message: 'TermsOfUse' }),
});

/**
 * Step 2: Project Overview
 * Fields: projectTitle, projectDescription, objective
 */
export const step2Schema = (t: (key: string) => string) =>
  z.object({
    projectTitle: z
      .string({ error: t('projectTitleRequired') })
      .min(1, { message: t('projectTitleRequired') }),
    projectDescription: z
      .string({ error: t('projectDescriptionRequired') })
      .min(1, { message: t('projectDescriptionRequired') })
      .max(1000, { message: t('MaximumFieldSize') }),
    objective: z.string().optional(),
  });

/**
 * Step 3: Project Stage & Files
 * Fields: stageDevelopment, projectFiles
 */
export const step3Schema = (t: (key: string) => string) =>
  z.object({
    stageDevelopment: z.nativeEnum(StageDevelopment).optional(),
    projectFiles: z
      .array(z.instanceof(File))
      .max(10, { message: t('MaximumFiles') })
      .optional()
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          return files.every((file) => mediaTypes.includes(file.type));
        },
        { message: t('InvalidFileType') },
      )
      .refine(
        (files) => {
          if (!files || files.length === 0) return true;
          const maxSize = 10 * 1024 * 1024; // 10MB
          return files.every((file) => file.size <= maxSize);
        },
        { message: t('FileTooLarge') },
      ),
  });

/**
 * Step 4: Review & Submit
 * Fields: TermsOfUse
 */
export const step4Schema = (t: (key: string) => string) =>
  z.object({
    TermsOfUse: z.boolean().refine((value) => value === true, {
      message: t('TermsOfUse'),
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
export type CompleteFormData = z.infer<
  ReturnType<typeof completeRegistrationSchema>
>;

// Validation schema for status update
export const statusUpdateSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().optional(),
  nextSteps: z.array(z.string()).optional(),
  locale: z.enum(['ar', 'en']).optional().default('en'),
});
