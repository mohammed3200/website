import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import mariadb from 'mariadb';

declare global {
  var prisma: PrismaClient | undefined;
}

// Create MariaDB adapter instance
// The adapter handles the connection pool internally
const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string);

// Create Prisma Client with adapter
export const db = globalThis.prisma || new PrismaClient({ 
  adapter,
  log: ['query', 'error', 'warn'],
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
