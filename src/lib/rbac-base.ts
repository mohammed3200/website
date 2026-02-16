export const RESOURCES = {
  USERS: 'users',
  NEWS: 'news',
  COLLABORATORS: 'collaborators',
  INNOVATORS: 'innovators',
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  INVITATIONS: 'invitations',
  CONTENT: 'content',
  TEMPLATES: 'templates',
  MESSAGES: 'messages',
  REPORTS: 'reports',
  STRATEGIC_PLANS: 'strategic_plans',
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

/**
 * Pure function to check permissions from a session's permission array.
 * Safe for use in both Client and Server (including Edge Middleware).
 */
export function checkPermission(
  permissions: Array<{ resource: string; action: string }> | undefined,
  resource: Resource,
  action: Action,
): boolean {
  if (!permissions) return false;

  return permissions.some(
    (p) =>
      p.resource === resource &&
      (p.action === action || p.action === ACTIONS.MANAGE),
  );
}
