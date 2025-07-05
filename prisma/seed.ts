import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.INIT_ADMIN_PASSWORD!,
    10
  );

  await prisma.admin.upsert({
    where: { username: process.env.INIT_ADMIN_USERNAME! },
    update: {},
    create: {
      username: process.env.INIT_ADMIN_USERNAME!,
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
