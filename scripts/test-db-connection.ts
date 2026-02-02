import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables correctly in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function testConnection() {
  try {
    console.log(`Connecting via Prisma with MariaDB Adapter...`);
    await prisma.$connect();
    console.log("Connected successfully!");
    const result = await prisma.$queryRaw`SELECT 1 as val`;
    console.log("Query Result:", result);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
