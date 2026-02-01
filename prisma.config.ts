import 'dotenv/config';
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
