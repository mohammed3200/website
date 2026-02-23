/**
 * Prisma 6 Configuration
 * This file is dependency-free so it can be loaded in production Docker containers.
 */
export default {
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
};
