/**
 * Support for loading .env files in local development.
 * In production/Docker, environment variables are typically provided by the host.
 */
if (process.env.NODE_ENV !== 'production') {
  try {
    await import('dotenv/config');
  } catch (e) {
    // Ignore if dotenv is not available
  }
}
import { defineConfig, env } from 'prisma/config';

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
    url: env('DATABASE_URL'),
  },
});
