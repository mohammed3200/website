// src/app/api/[[...route]]/route.ts
import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import collaborator from '@/features/collaborators/server/route';
import innovators from '@/features/innovators/server/route';
import admin from '@/features/admin/server/route';
import strategicPlan from '@/features/strategic-plan/server/route';
import news from '@/features/news/server/route';
import pageContent from '@/features/page-content/server/route';

const app = new Hono().basePath('/api');

// Global middleware
app.use(
  '/*',
  cors({
    origin: (origin) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

      // If no allowed origins configured, reject all
      if (allowedOrigins.length === 0) return null;

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return allowedOrigins[0] || null;

      // Allow if origin is in the allowlist
      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      // Reject non-matching origins
      return null;
    },
    credentials: true,
  }),
);
app.use('/*', logger());

// RESTful routes (existing)
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
const routes = app
  .route('/collaborator', collaborator)
  .route('/innovators', innovators)
  .route('/admin', admin)
  .route('/strategicPlan', strategicPlan)
  .route('/news', news)
  .route('/pageContent', pageContent);

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal error',
        data: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      id: null,
    },
    500,
  );
});

// 404 handler for RPC
app.notFound((c) => {
  if (c.req.path.includes('/rpc')) {
    return c.json(
      {
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: 'Method not found',
        },
        id: null,
      },
      404,
    );
  }
  return c.json({ error: 'Not Found' }, 404);
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
