/**
 * RBAC Integrity Verification Script
 * Run after seeding to ensure RBAC system integrity
 * Usage: bun run rbac:verify
 */
import { db } from '../src/lib/db';
import { SYSTEM_ROLES, ROLE_PERMISSIONS, RESOURCES, ACTIONS } from '../src/lib/rbac';

async function verifyRBAC() {
  console.log('🔍 Verifying RBAC Integrity...\n');
  
  let errors = 0;

  // 1. Verify all system roles exist
  console.log('📋 Checking system roles...');
  for (const roleName of Object.values(SYSTEM_ROLES)) {
    const role = await db.role.findUnique({ where: { name: roleName } });
    if (!role) {
      console.error(`  ❌ Missing role: ${roleName}`);
      errors++;
    } else {
      console.log(`  ✅ ${roleName}`);
    }
  }

  // 2. Verify all permissions exist
  console.log('\n🔐 Checking permissions...');
  const expectedPerms = Object.values(RESOURCES).length * Object.values(ACTIONS).length;
  const actualPerms = await db.permission.count();
  
  if (actualPerms !== expectedPerms) {
    console.error(`  ❌ Permission count mismatch: expected ${expectedPerms}, got ${actualPerms}`);
    errors++;
  } else {
    console.log(`  ✅ All ${actualPerms} permissions exist`);
  }

  // 3. Verify role-permission mappings
  console.log('\n🔗 Checking role-permission mappings...');
  for (const [roleKey, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await db.role.findUnique({
      where: { name: roleKey },
      include: { permissions: { include: { permission: true } } }
    });
    
    if (!role) {
      console.error(`  ❌ Role not found: ${roleKey}`);
      errors++;
      continue;
    }

    if (role.permissions.length !== permissions.length) {
      console.error(`  ❌ ${roleKey}: expected ${permissions.length} permissions, got ${role.permissions.length}`);
      errors++;
    } else {
      console.log(`  ✅ ${roleKey}: ${role.permissions.length} permissions`);
    }
  }

  // 4. Verify super admin exists
  console.log('\n👤 Checking super admin...');
  const adminEmail = process.env.INIT_ADMIN_EMAIL;
  const admin = await db.user.findUnique({
    where: { email: adminEmail },
    include: { role: true }
  });

  if (!admin) {
    console.error(`  ❌ Admin user not found: ${adminEmail}`);
    errors++;
  } else if (admin.role?.name !== SYSTEM_ROLES.SUPER_ADMIN) {
    console.error(`  ❌ Admin has wrong role: ${admin.role?.name}`);
    errors++;
  } else {
    console.log(`  ✅ Super admin exists: ${admin.email}`);
    console.log(`     Role: ${admin.role.name}`);
    console.log(`     Active: ${admin.isActive}`);
  }

  // 5. Check for orphaned users (no role)
  console.log('\n🔍 Checking for orphaned users...');
  const orphanedUsers = await db.user.count({ where: { roleId: null } });
  if (orphanedUsers > 0) {
    console.warn(`  ⚠️  ${orphanedUsers} users without roles`);
  } else {
    console.log(`  ✅ All users have roles`);
  }

  // 6. Verify system roles are protected
  console.log('\n🛡️  Verifying system role protection...');
  const systemRoles = await db.role.findMany({ where: { isSystem: true } });
  const expectedSystemRoles = Object.values(SYSTEM_ROLES).length;
  
  if (systemRoles.length !== expectedSystemRoles) {
    console.error(`  ❌ System role count mismatch: expected ${expectedSystemRoles}, got ${systemRoles.length}`);
    errors++;
  } else {
    console.log(`  ✅ All ${expectedSystemRoles} system roles protected`);
  }

  // Final Report
  console.log('\n' + '='.repeat(60));
  if (errors === 0) {
    console.log('✅ RBAC INTEGRITY CHECK PASSED - System is secure and ready');
  } else {
    console.error(`❌ RBAC INTEGRITY CHECK FAILED - ${errors} error(s) detected`);
    console.error('\n⚠️  DO NOT DEPLOY until all errors are resolved!');
    process.exit(1);
  }
  console.log('='.repeat(60) + '\n');

  await db.$disconnect();
}

verifyRBAC().catch((error) => {
  console.error('💥 Fatal error during RBAC verification:', error);
  process.exit(1);
});
