import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

declare global {
  var prisma: PrismaClient | undefined;
}

const connectionString = `${process.env.DATABASE_URL}`;

// Create MariaDB adapter factory
const adapter = new PrismaMariaDb(connectionString);

// Create Prisma Client
export const db = globalThis.prisma || new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
