import { z } from 'zod';

export const statsTrendsQuerySchema = z.object({
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .default(new Date().getFullYear()),
});

export const statsBreakdownQuerySchema = z.object({
  // Add any filters if needed in the future
});
