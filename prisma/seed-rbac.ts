import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { SYSTEM_ROLES, ROLE_PERMISSIONS, RESOURCES, ACTIONS } from "../src/lib/rbac";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting RBAC system initialization...");

  try {
    // Step 1: Create all permissions
    console.log("Creating permissions...");
    const permissions = [];
    
    for (const resource of Object.values(RESOURCES)) {
      for (const action of Object.values(ACTIONS)) {
        const permission = await prisma.permission.upsert({
          where: {
            resource_action: {
              resource: resource,
              action: action,
            },
          },
          update: {},
          create: {
            name: `${resource}:${action}`,
            resource: resource,
            action: action,
            description: `${action} permission for ${resource}`,
          },
        });
        permissions.push(permission);
        console.log(`  ✓ Created permission: ${permission.name}`);
      }
    }

    // Step 2: Create system roles
    console.log("\nCreating system roles...");
    
    for (const [roleKey, rolePermissions] of Object.entries(ROLE_PERMISSIONS)) {
      const role = await prisma.role.upsert({
        where: { name: roleKey },
        update: {
          description: `System role: ${roleKey.replace(/_/g, " ").toUpperCase()}`,
        },
        create: {
          name: roleKey,
          description: `System role: ${roleKey.replace(/_/g, " ").toUpperCase()}`,
          isSystem: true,
        },
      });
      
      console.log(`  ✓ Created role: ${role.name}`);

      // Step 3: Assign permissions to roles
      console.log(`    Assigning permissions to ${role.name}...`);
      
      for (const perm of rolePermissions) {
        const permission = await prisma.permission.findUnique({
          where: {
            resource_action: {
              resource: perm.resource,
              action: perm.action,
            },
          },
        });

        if (permission) {
          await prisma.rolePermission.upsert({
            where: {
              roleId_permissionId: {
                roleId: role.id,
                permissionId: permission.id,
              },
            },
            update: {},
            create: {
              roleId: role.id,
              permissionId: permission.id,
            },
          });
          console.log(`      ✓ Assigned ${permission.name}`);
        }
      }
    }

    // Step 4: Create super admin user if not exists
    console.log("\nCreating super admin user...");
    
    const adminEmail = process.env.INIT_ADMIN_USERNAME || "admin@example.com";
    const adminPassword = process.env.INIT_ADMIN_PASSWORD || "Admin@123456";
    
    // Get super admin role
    const superAdminRole = await prisma.role.findUnique({
      where: { name: SYSTEM_ROLES.SUPER_ADMIN },
    });

    if (superAdminRole) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
          roleId: superAdminRole.id,
        },
        create: {
          email: adminEmail,
          name: "Super Admin",
          password: hashedPassword,
          emailVerified: new Date(),
          roleId: superAdminRole.id,
          isActive: true,
        },
      });

      console.log(`  ✓ Super admin user created/updated: ${adminUser.email}`);
    }

    // Step 5: Migrate existing users to new role system (if any)
    console.log("\nMigrating existing users to new role system...");
    
    const usersWithoutRole = await prisma.user.findMany({
      where: { roleId: null },
    });

    if (usersWithoutRole.length > 0) {
      // Get viewer role as default
      const viewerRole = await prisma.role.findUnique({
        where: { name: SYSTEM_ROLES.VIEWER },
      });

      if (viewerRole) {
        for (const user of usersWithoutRole) {
          await prisma.user.update({
            where: { id: user.id },
            data: { roleId: viewerRole.id },
          });
          console.log(`  ✓ Migrated user ${user.email} to viewer role`);
        }
      }
    } else {
      console.log("  ✓ No users to migrate");
    }

    console.log("\n✅ RBAC system initialization completed successfully!");
    
    // Display summary
    const roleCount = await prisma.role.count();
    const permissionCount = await prisma.permission.count();
    const userCount = await prisma.user.count();
    
    console.log("\n📊 Summary:");
    console.log(`  - Roles created: ${roleCount}`);
    console.log(`  - Permissions created: ${permissionCount}`);
    console.log(`  - Total users: ${userCount}`);
    
  } catch (error) {
    console.error("❌ Error during RBAC initialization:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
