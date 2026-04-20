/**
 * Prisma 7 Configuration
 */
const config = {
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

export default config;
