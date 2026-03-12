import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Prisma 7 Configuration
 */
export default defineConfig({
  // Schema location
  schema: 'prisma/schema.prisma',

  // Migration settings
  migrations: {
    path: 'prisma/migrations',
    seed: 'bun run seed',
  },

  // Database connection
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
