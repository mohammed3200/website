// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.INIT_ADMIN_PASSWORD!,
    10
  );

  await prisma.user.upsert({
    where: { email: process.env.INIT_ADMIN_EMAIL! },
    update: {},
    create: {
      email: process.env.INIT_ADMIN_EMAIL!,
      password: passwordHash,
      role: "GENERAL_MANAGER",
    },
  });

  console.log("✅ Seeded initial admin");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());