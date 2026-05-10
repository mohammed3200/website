import { z } from 'zod';

export const expertSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  fullNameEn: z.string().optional(),
  title: z.string().min(2, 'Title is required'),
  titleEn: z.string().optional(),
  specialization: z.string().min(2, 'Specialization is required'),
  specializationEn: z.string().optional(),
  university: z.string().min(2, 'University is required'),
  universityEn: z.string().optional(),
  bio: z.string().min(10, 'Bio is required'),
  bioEn: z.string().optional(),
  cv: z.string().optional(),
  cvEn: z.string().optional(),
  profileImage: z.string().optional(),
  email: z.union([z.string().email(), z.literal('')]).optional(),
  linkedin: z.union([z.string().url(), z.literal('')]).optional(),
  order: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export type ExpertFormValues = z.infer<typeof expertSchema>;
