import { PrismaClient } from '@prisma/client/edge';

// Force Node.js runtime
export const runtime = 'edge';

const prisma = new PrismaClient();

export default prisma;