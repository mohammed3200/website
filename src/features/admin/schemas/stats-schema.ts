import { z } from 'zod';

export const statsTrendsQuerySchema = z.object({
  year: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : new Date().getFullYear())),
});

export const statsBreakdownQuerySchema = z.object({
  // Add any filters if needed in the future
});
