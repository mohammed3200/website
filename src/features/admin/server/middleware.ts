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
  const session = await auth();

  if (!session?.user?.id) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('user', session.user as Variables['user']);
  await next();
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
