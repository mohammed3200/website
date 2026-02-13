import { db } from '@/lib/db';
// import { User, Role, Permission } from "@prisma/client";

// Define resources and actions
export const RESOURCES = {
  USERS: 'users',
  NEWS: 'news',
  COLLABORATORS: 'collaborators',
  INNOVATORS: 'innovators',
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  INVITATIONS: 'invitations',
} as const;

export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // Full control
  INVITE: 'invite',
  APPROVE: 'approve',
  REJECT: 'reject',
} as const;

export type Resource = (typeof RESOURCES)[keyof typeof RESOURCES];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

// Default system roles
export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  NEWS_EDITOR: 'news_editor',
  REQUEST_REVIEWER: 'request_reviewer',
  VIEWER: 'viewer',
} as const;

export type SystemRole = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];

// Permission definitions for system roles
export const ROLE_PERMISSIONS: Record<
  SystemRole,
  Array<{ resource: Resource; action: Action }>
> = {
  [SYSTEM_ROLES.SUPER_ADMIN]: [
    // Full access to everything
    { resource: RESOURCES.USERS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.NEWS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.COLLABORATORS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.INNOVATORS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.DASHBOARD, action: ACTIONS.MANAGE },
    { resource: RESOURCES.SETTINGS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.INVITATIONS, action: ACTIONS.MANAGE },
  ],
  [SYSTEM_ROLES.ADMIN]: [
    // Can manage most things except system settings
    { resource: RESOURCES.USERS, action: ACTIONS.READ },
    { resource: RESOURCES.USERS, action: ACTIONS.INVITE },
    { resource: RESOURCES.NEWS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.COLLABORATORS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.INNOVATORS, action: ACTIONS.MANAGE },
    { resource: RESOURCES.DASHBOARD, action: ACTIONS.READ },
    { resource: RESOURCES.INVITATIONS, action: ACTIONS.CREATE },
    { resource: RESOURCES.INVITATIONS, action: ACTIONS.READ },
  ],
  [SYSTEM_ROLES.NEWS_EDITOR]: [
    // Can only manage news
    { resource: RESOURCES.NEWS, action: ACTIONS.CREATE },
    { resource: RESOURCES.NEWS, action: ACTIONS.READ },
    { resource: RESOURCES.NEWS, action: ACTIONS.UPDATE },
    { resource: RESOURCES.NEWS, action: ACTIONS.DELETE },
    { resource: RESOURCES.DASHBOARD, action: ACTIONS.READ },
  ],
  [SYSTEM_ROLES.REQUEST_REVIEWER]: [
    // Can review and approve/reject requests
    { resource: RESOURCES.COLLABORATORS, action: ACTIONS.READ },
    { resource: RESOURCES.COLLABORATORS, action: ACTIONS.APPROVE },
    { resource: RESOURCES.COLLABORATORS, action: ACTIONS.REJECT },
    { resource: RESOURCES.INNOVATORS, action: ACTIONS.READ },
    { resource: RESOURCES.INNOVATORS, action: ACTIONS.APPROVE },
    { resource: RESOURCES.INNOVATORS, action: ACTIONS.REJECT },
    { resource: RESOURCES.DASHBOARD, action: ACTIONS.READ },
  ],
  [SYSTEM_ROLES.VIEWER]: [
    // Read-only access
    { resource: RESOURCES.NEWS, action: ACTIONS.READ },
    { resource: RESOURCES.COLLABORATORS, action: ACTIONS.READ },
    { resource: RESOURCES.INNOVATORS, action: ACTIONS.READ },
    { resource: RESOURCES.DASHBOARD, action: ACTIONS.READ },
  ],
};

// Check if user has permission
export async function hasPermission(
  userId: string,
  resource: Resource,
  action: Action,
): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId, isActive: true },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.role) return false;

    // Check for manage permission (overrides all)
    const hasManagePermission = user.role.permissions.some(
      (rp: any) =>
        rp.permission.resource === resource &&
        rp.permission.action === ACTIONS.MANAGE,
    );

    if (hasManagePermission) return true;

    // Check for specific permission
    return user.role.permissions.some(
      (rp: any) =>
        rp.permission.resource === resource && rp.permission.action === action,
    );
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

// Get user permissions
export async function getUserPermissions(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId, isActive: true },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.role) return [];

    return user.role.permissions.map((rp: any) => ({
      resource: rp.permission.resource,
      action: rp.permission.action,
    }));
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

// Initialize system roles and permissions
export async function initializeRoles() {
  try {
    // Create permissions
    const permissionPromises = [];
    for (const resource of Object.values(RESOURCES)) {
      for (const action of Object.values(ACTIONS)) {
        permissionPromises.push(
          db.permission.upsert({
            where: {
              resource_action: { resource, action },
            },
            update: {},
            create: {
              name: `${resource}:${action}`,
              resource,
              action,
              description: `${action} permission for ${resource}`,
            },
          }),
        );
      }
    }
    await Promise.all(permissionPromises);

    // Create system roles
    for (const [roleKey, permissions] of Object.entries(ROLE_PERMISSIONS)) {
      const role = await db.role.upsert({
        where: { name: roleKey },
        update: {},
        create: {
          name: roleKey,
          description: `System role: ${roleKey.replace('_', ' ').toUpperCase()}`,
          isSystem: true,
        },
      });

      // Assign permissions to role
      for (const perm of permissions) {
        const permission = await db.permission.findUnique({
          where: {
            resource_action: {
              resource: perm.resource,
              action: perm.action,
            },
          },
        });

        if (permission) {
          await db.rolePermission.upsert({
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
        }
      }
    }

    console.log('System roles and permissions initialized successfully');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
}

// Create invitation
export async function createUserInvitation(
  inviterId: string,
  email: string,
  roleId: string,
  expiresInHours: number = 48,
) {
  const inviter = await db.user.findUnique({
    where: { id: inviterId },
    include: { role: true },
  });

  if (!inviter) {
    throw new Error('Inviter not found');
  }

  // Check if inviter has permission to invite users
  const canInvite = await hasPermission(
    inviterId,
    RESOURCES.INVITATIONS,
    ACTIONS.CREATE,
  );
  if (!canInvite) {
    throw new Error("You don't have permission to invite users");
  }

  // Check if there's already a pending invitation
  const existingInvitation = await db.userInvitation.findFirst({
    where: {
      email,
      status: 'PENDING',
    },
  });

  if (existingInvitation) {
    throw new Error('An invitation is already pending for this email');
  }

  // Generate unique token
  const token = generateInvitationToken();
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

  return await db.userInvitation.create({
    data: {
      email,
      token,
      roleId,
      invitedBy: inviterId,
      expiresAt,
    },
    include: {
      role: true,
      inviter: true,
    },
  });
}

// Helper function to generate invitation token
function generateInvitationToken(): string {
  // Use crypto for secure token generation
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

// Accept invitation
export async function acceptInvitation(token: string, userId: string) {
  const invitation = await db.userInvitation.findUnique({
    where: { token },
    include: { role: true },
  });

  if (!invitation) {
    throw new Error('Invalid invitation token');
  }

  if (invitation.status !== 'PENDING') {
    throw new Error('This invitation has already been used');
  }

  if (new Date() > invitation.expiresAt) {
    await db.userInvitation.update({
      where: { id: invitation.id },
      data: { status: 'EXPIRED' },
    });
    throw new Error('This invitation has expired');
  }

  // Update user role and invitation status
  await db.$transaction([
    db.user.update({
      where: { id: userId },
      data: {
        roleId: invitation.roleId,
        invitedBy: invitation.invitedBy,
      },
    }),
    db.userInvitation.update({
      where: { id: invitation.id },
      data: {
        status: 'ACCEPTED',
        acceptedBy: userId,
        acceptedAt: new Date(),
      },
    }),
  ]);

  return invitation;
}
