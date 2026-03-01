import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db } from '@/lib/db';
import {
  verifyAuth,
  requirePermission,
} from '@/features/admin/server/middleware';
import { RESOURCES, ACTIONS } from '@/lib/rbac-base';
import { createUserInvitation } from '@/lib/rbac';
import {
  updateUserSchema,
  createInvitationSchema,
  userQuerySchema,
  invitationIdParamSchema,
} from '../schemas/user-schema';
import { emailQueue } from '@/lib/queue/email-queue';

const app = new Hono()
  // GET /api/users
  .get(
    '/',
    verifyAuth,
    requirePermission(RESOURCES.USERS, ACTIONS.READ),
    zValidator('query', userQuerySchema),
    async (c) => {
      const { page, limit, role, status, search } = c.req.valid('query');
      const skip = (page - 1) * limit;

      const where: any = {};
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

      const mappedUsers = users.map((u) => ({ ...u, lastLoginAt: null }));

      return c.json({
        data: mappedUsers,
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

      const user = await db.user.findUnique({ where: { id } });
      if (!user) return c.json({ error: 'User not found' }, 404);

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

      return c.json({ data: { ...updated, lastLoginAt: null } });
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

      const user = await db.user.findUnique({ where: { id } });
      if (!user) return c.json({ error: 'User not found' }, 404);

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
    async (c) => {
      const invitations = await db.userInvitation.findMany({
        include: {
          role: { select: { id: true, name: true } },
          inviter: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return c.json({ data: invitations });
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
        const user = c.get('user') as any;
        const { email, roleId } = c.req.valid('json');

        const invitation = await createUserInvitation(user.id, email, roleId);

        const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/join?token=${invitation.token}`;

        try {
          await emailQueue.add('send-invitation', {
            to: email,
            subject: 'You have been invited to join the platform',
            template: 'Custom',
            context: {
              html: `<p>Please click <a href="${inviteLink}">here</a> to join.</p>`,
            },
          });
        } catch (err) {
          console.error('Failed to queue email', err);
        }

        return c.json({ data: invitation }, 201);
      } catch (error: any) {
        console.error('Invitation error:', error);
        return c.json(
          { error: error.message || 'Failed to create invitation' },
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
