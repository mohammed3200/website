import { z } from 'zod';

export const createReportSchema = z.object({
  name: z.string(),
  type: z.enum([
    'SUBMISSIONS_SUMMARY',
    'USER_ACTIVITY',
    'STRATEGIC_PLANS',
    'FULL_PLATFORM',
  ]),
  format: z.enum(['PDF', 'CSV']),
  parameters: z.record(z.string(), z.any()).optional(),
});

export const reportIdParamSchema = z.object({
  id: z.string(),
});
