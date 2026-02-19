import { Context, Next } from 'hono';
import { auth } from '@/auth';
import { Resource, Action, checkPermission } from '@/lib/rbac-base';
import type { Session } from 'next-auth';

type Variables = {
  user: Session['user'] & {
    id: string;
  };
};

/**
 * Middleware to verify user is authenticated
 */
export const verifyAuth = async (
  c: Context<{ Variables: Variables }>,
  next: Next,
) => {
  // 1. Try NextAuth session (browser-based)
  const session = await auth();

  if (session?.user?.id) {
    c.set('user', session.user as Variables['user']);
    return await next();
  }

  // 2. Try API Key (system-to-system / automated)
  const apiKey =
    c.req.header('X-Admin-API-Key') ||
    c.req.header('Authorization')?.replace('Bearer ', '');

  const systemAdminKey = process.env.ADMIN_API_KEY;

  if (systemAdminKey && apiKey === systemAdminKey) {
    // If authenticated via API Key, we treat it as a system-level admin
    // We provide a minimal "system" user object if needed, or just let it through
    // for specific routes. For now, we'll try to find an admin user in DB
    // or provide a mock since most routes expect user.id
    c.set('user', {
      id: 'system',
      name: 'System Admin',
      role: 'SUPER_ADMIN', // Assume super admin for API key
      permissions: ['*'], // All permissions
    } as any);
    return await next();
  }

  return c.json({ error: 'Unauthorized' }, 401);
};

/**
 * Middleware to check for specific resource permissions
 */
export const requirePermission = (resource: Resource, action: Action) => {
  return async (c: Context<{ Variables: Variables }>, next: Next) => {
    const user = c.get('user');

    // In Hono middleware chaining, verifyAuth should be called first
    // but we check again just in case for safety
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const permissions = user.permissions as any;

    const hasPermission = checkPermission(permissions, resource, action);

    if (!hasPermission) {
      return c.json({ error: 'Forbidden' }, 403);
    }

    await next();
  };
};
