import { z } from 'zod';

export const expertSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  fullNameEn: z.string().default(''),
  title: z.string().min(2, 'Title is required'),
  titleEn: z.string().default(''),
  specialization: z.string().min(2, 'Specialization is required'),
  specializationEn: z.string().default(''),
  university: z.string().min(2, 'University is required'),
  universityEn: z.string().default(''),
  bio: z.string().min(10, 'Bio is required'),
  bioEn: z.string().default(''),
  cv: z.string().default(''),
  cvEn: z.string().default(''),
  profileImage: z.string().default(''),
  email: z.string().default(''),
  linkedin: z.string().default(''),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type ExpertFormValues = z.infer<typeof expertSchema>;
