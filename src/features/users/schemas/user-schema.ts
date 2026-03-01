import { z } from 'zod';

export const updateUserSchema = z.object({
  roleId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const createInvitationSchema = z.object({
  email: z.string().email('Invalid email format'),
  roleId: z.string().min(1, 'Role is required'),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  role: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  search: z.string().optional(),
});

export const invitationIdParamSchema = z.object({
  id: z.string(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
