import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const connectionString = `${process.env.DATABASE_URL}`;

// PrismaMariaDb is Prisma 7's driver adapter for MySQL/MariaDB (client engine)
const adapter = new PrismaMariaDb(connectionString);

// Create Prisma Client with driver adapter (required by Prisma 7 client engine)
export const db = globalThis.prisma || new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
