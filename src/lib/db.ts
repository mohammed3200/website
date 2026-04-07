import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { isBuildPhase } from './env-utils';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  (isBuildPhase ? 'mysql://localhost:3306/placeholder' : '');

if (!connectionString && !isBuildPhase) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

const prismaClientSingleton = () => {
  const adapter = new PrismaMariaDb(connectionString);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
