/**
 * Academic Experts Seed Script — Bilingual (Arabic + English)
 *
 * Creates sample academic expert profiles for the EBIC platform.
 * Safe to run multiple times (uses upsert on fullName field).
 *
 * Usage:
 *   bun run seed:experts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL environment variable is missing.');
  process.exit(1);
}

const adapter = new PrismaMariaDb(dbUrl);
const db = new PrismaClient({ adapter, log: ['error'] });

interface ExpertSeed {
  fullName: string;
  fullNameEn: string;
  title: string;
  titleEn: string;
  specialization: string;
  specializationEn: string;
  university: string;
  universityEn: string;
  bio: string;
  bioEn: string;
  email: string;
  order: number;
  isActive: boolean;
}

const experts: ExpertSeed[] = [];

async function seedAcademicExperts() {
  console.log('🔄 Seeding Academic Experts...');

  let processed = 0;

  for (const expert of experts) {
    await db.academicExpert.upsert({
      where: { fullName: expert.fullName },
      update: {
        ...expert,
        // Preserve existing profileImage and cv if not explicitly overridden by seed
        profileImage: undefined,
        cv: undefined,
        cvEn: undefined,
      },
      create: expert,
    });
    processed++;
  }

  console.log(
    `✅ Academic Experts seeded: ${processed} processed (${experts.length} total)`,
  );
}

seedAcademicExperts()
  .catch((e) => {
    console.error('❌ Academic Experts seed failed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
