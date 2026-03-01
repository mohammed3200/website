import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { db } from '@/lib/db';
import {
  verifyAuth,
  requirePermission,
} from '@/features/admin/server/middleware';
import type { Variables } from '@/features/admin/server/middleware';
import { RESOURCES, ACTIONS } from '@/lib/rbac-base';
import { createUserInvitation } from '@/lib/rbac';
import {
  updateUserSchema,
  createInvitationSchema,
  userQuerySchema,
  invitationIdParamSchema,
} from '../schemas/user-schema';
import { emailQueue } from '@/lib/queue/email-queue';

const app = new Hono<{ Variables: Variables }>()
  // GET /api/users
  .get(
    '/',
    verifyAuth,
    requirePermission(RESOURCES.USERS, ACTIONS.READ),
    zValidator('query', userQuerySchema),
    async (c) => {
      const { page, limit, role, status, search } = c.req.valid('query');
      const skip = (page - 1) * limit;

      const where: Prisma.UserWhereInput = {};
      if (role) where.roleId = role;
      if (status) where.isActive = status === 'active';
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { email: { contains: search } },
        ];
      }

      const [users, total] = await Promise.all([
        db.user.findMany({
          where,
          skip,
          take: limit,
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isActive: true,
            role: {
              select: { id: true, name: true },
            },
          },
          orderBy: { name: 'asc' },
        }),
        db.user.count({ where }),
      ]);

      return c.json({
        data: users,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    },
  )

  // GET /api/users/roles
  .get(
    '/roles',
    verifyAuth,
    requirePermission(RESOURCES.USERS, ACTIONS.READ),
    async (c) => {
      const roles = await db.role.findMany({
        select: { id: true, name: true, description: true },
        orderBy: { name: 'asc' },
      });
      return c.json({ data: roles });
    },
  )

  // PATCH /api/users/:id
  .patch(
    '/:id',
    verifyAuth,
    requirePermission(RESOURCES.USERS, ACTIONS.MANAGE),
    zValidator('param', z.object({ id: z.string() })),
    zValidator('json', updateUserSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      const data = c.req.valid('json');

      const user = await db.user.findUnique({
        where: { id },
        include: { role: true },
      });
      if (!user) return c.json({ error: 'User not found' }, 404);

      const requester = c.get('user');
      if (requester.id === id) {
        return c.json({ error: 'You cannot modify your own roles or status' }, 403);
      }

      if (data.roleId || data.isActive !== undefined) {
        // Enforce role hierarchy: Admins cannot modify Super Admins
        if (user.role?.name?.toLowerCase() === 'super_admin' && requester.role?.toLowerCase() !== 'super_admin') {
          return c.json({ error: 'Not permitted to modify super_admin accounts' }, 403);
        }
      }

      if (data.roleId) {
        // Enforce role hierarchy: Admins cannot promote to Super Admin
        const newRole = await db.role.findUnique({ where: { id: data.roleId } });
        if (newRole?.name?.toLowerCase() === 'super_admin' && requester.role?.toLowerCase() !== 'super_admin') {
          return c.json({ error: 'Not permitted to promote to super_admin role' }, 403);
        }
      }

      const updated = await db.user.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          isActive: true,
          role: { select: { id: true, name: true } },
        },
      });

      return c.json({ data: updated });
    },
  )

  // DELETE /api/users/:id
  .delete(
    '/:id',
    verifyAuth,
    requirePermission(RESOURCES.USERS, ACTIONS.MANAGE),
    zValidator('param', z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid('param');

      const user = await db.user.findUnique({
        where: { id },
        include: { role: true },
      });
      if (!user) return c.json({ error: 'User not found' }, 404);

      const requester = c.get('user');
      if (requester.id === id) {
        return c.json({ error: 'You cannot deactivate your own account' }, 403);
      }

      if (user.role?.name?.toLowerCase() === 'super_admin' && requester.role?.toLowerCase() !== 'super_admin') {
        return c.json({ error: 'Not permitted to deactivate super_admin accounts' }, 403);
      }

      await db.user.update({
        where: { id },
        data: { isActive: false },
      });

      return c.json({ success: true });
    },
  )

  // GET /api/users/invitations/list
  .get(
    '/invitations/list',
    verifyAuth,
    requirePermission(RESOURCES.INVITATIONS, ACTIONS.READ),
    zValidator('query', z.object({
      page: z.string().transform(Number).default(1),
      limit: z.string().transform(Number).default(25),
    })),
    async (c) => {
      const { page, limit } = c.req.valid('query');
      const skip = (page - 1) * limit;

      const [invitations, total] = await Promise.all([
        db.userInvitation.findMany({
          skip,
          take: limit,
          include: {
            role: { select: { id: true, name: true } },
            inviter: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: 'desc' },
        }),
        db.userInvitation.count(),
      ]);

      return c.json({
        data: invitations,
        metadata: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    },
  )

  // POST /api/users/invite
  .post(
    '/invite',
    verifyAuth,
    requirePermission(RESOURCES.INVITATIONS, ACTIONS.CREATE),
    zValidator('json', createInvitationSchema),
    async (c) => {
      try {
        const user = c.get('user');
        const { email, roleId } = c.req.valid('json');

        const invitation = await createUserInvitation(user.id, email, roleId);

        if (!process.env.NEXT_PUBLIC_APP_URL) {
          throw new Error('NEXT_PUBLIC_APP_URL is not configured in environment variables');
        }

        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/join?token=${invitation.token}`;

        let emailQueued = false;
        let emailError = null;

        try {
          await emailQueue.add('send-invitation', {
            to: email,
            subject: 'You have been invited to join the platform',
            template: 'Custom',
            context: {
              html: `<p>Please click <a href="${inviteLink}">here</a> to join.</p>`,
            },
          });
          emailQueued = true;
        } catch (err: unknown) {
          console.error('Failed to queue email', err);
          emailError = (err as Error).message || 'Unknown error';
        }

        return c.json({
          data: invitation,
          emailQueued,
          emailError,
        }, 201);
      } catch (error: unknown) {
        console.error('Invitation error:', error);
        return c.json(
          { error: (error as Error).message || 'Failed to create invitation' },
          400,
        );
      }
    },
  )

  // DELETE /api/users/invitations/:id
  .delete(
    '/invitations/:id',
    verifyAuth,
    requirePermission(RESOURCES.INVITATIONS, ACTIONS.MANAGE),
    zValidator('param', invitationIdParamSchema),
    async (c) => {
      const { id } = c.req.valid('param');

      const invitation = await db.userInvitation.findUnique({ where: { id } });
      if (!invitation) return c.json({ error: 'Invitation not found' }, 404);

      await db.userInvitation.delete({ where: { id } });

      return c.json({ success: true });
    },
  );

export default app;
