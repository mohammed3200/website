// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(
    process.env.INIT_ADMIN_PASSWORD!,
    10
  );

  // First create or find the role
  const adminRole = await prisma.role.upsert({
    where: { name: "GENERAL_MANAGER" },
    update: {},
    create: {
      name: "GENERAL_MANAGER",
      description: "General Manager role with administrative privileges",
      isSystem: true,
    },
  });

  await prisma.user.upsert({
    where: { email: process.env.INIT_ADMIN_EMAIL! },
    update: {},
    create: {
      email: process.env.INIT_ADMIN_EMAIL!,
      password: passwordHash,
      name: "Admin User",
      emailVerified: new Date(),
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log("✅ Seeded initial admin with role");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());