import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const isBuildPhase =
  process.env.NEXT_PHASE === 'phase-production-build' ||
  process.env.npm_lifecycle_event === 'build';
const connectionString =
  process.env.DATABASE_URL ||
  (isBuildPhase ? 'mysql://localhost:3306/placeholder' : '');

if (!connectionString && !isBuildPhase) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// PrismaMariaDb is Prisma 7's driver adapter for MySQL/MariaDB (client engine)
const adapter = new PrismaMariaDb(connectionString);

// Create Prisma Client with driver adapter (required by Prisma 7 client engine)
export const db =
  globalThis.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
