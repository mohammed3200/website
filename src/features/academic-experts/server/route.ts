import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db } from '@/lib/db';
import { auth } from '@/auth';
import { expertSchema } from '../schemas';

/** Convert empty strings to null for optional fields before DB write */
function sanitize(data: Record<string, unknown>) {
  const result = { ...data };
  for (const key of Object.keys(result)) {
    if (result[key] === '') result[key] = null;
  }
  return result;
}

const app = new Hono()
  .get('/public', async (c) => {
    try {
      const experts = await db.academicExpert.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          order: 'asc',
        },
      });

      return c.json({ data: experts }, 200);
    } catch (error) {
      console.error('Error fetching public academic experts:', error);
      return c.json({ error: 'Failed to fetch academic experts' }, 500);
    }
  })
  .get('/', async (c) => {
    try {
      const session = await auth();
      if (!session?.user || session.user.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const experts = await db.academicExpert.findMany({
        orderBy: {
          order: 'asc',
        },
      });

      return c.json({ data: experts }, 200);
    } catch (error) {
      console.error('Error fetching academic experts:', error);
      return c.json({ error: 'Failed to fetch academic experts' }, 500);
    }
  })
  .post('/', zValidator('json', expertSchema), async (c) => {
    try {
      const session = await auth();
      if (!session?.user || session.user.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const raw = c.req.valid('json');
      const data = sanitize(raw);

      const expert = await db.academicExpert.create({
        data: data as typeof raw,
      });

      return c.json({ data: expert }, 201);
    } catch (error) {
      console.error('Error creating academic expert:', error);
      return c.json({ error: 'Failed to create academic expert' }, 500);
    }
  })
  .patch('/:id', zValidator('json', expertSchema), async (c) => {
    try {
      const session = await auth();
      if (!session?.user || session.user.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const id = c.req.param('id');
      const raw = c.req.valid('json');
      const data = sanitize(raw);

      const expert = await db.academicExpert.update({
        where: { id },
        data: data as typeof raw,
      });

      return c.json({ data: expert }, 200);
    } catch (error) {
      console.error('Error updating academic expert:', error);
      return c.json({ error: 'Failed to update academic expert' }, 500);
    }
  })
  .delete('/:id', async (c) => {
    try {
      const session = await auth();
      if (!session?.user || session.user.role !== 'admin') {
        return c.json({ error: 'Unauthorized' }, 401);
      }

      const id = c.req.param('id');

      await db.academicExpert.delete({
        where: { id },
      });

      return c.json({ success: true }, 200);
    } catch (error) {
      console.error('Error deleting academic expert:', error);
      return c.json({ error: 'Failed to delete academic expert' }, 500);
    }
  });

export default app;

