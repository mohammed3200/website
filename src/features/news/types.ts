import { z } from "zod";
import { newsSchema, createNewsSchema, updateNewsSchema } from "./schemas";

export type News = z.infer<typeof newsSchema>;
export type CreateNewsInput = z.infer<typeof createNewsSchema>;
export type UpdateNewsInput = z.infer<typeof updateNewsSchema>;

// Type for the response from the API, including relations
// This should match the 'include' in the Prisma query and the Zod schema if strictly aligned
export type NewsWithRelations = News; 
