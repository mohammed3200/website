import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: 'bun ./prisma/seed.ts',
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
