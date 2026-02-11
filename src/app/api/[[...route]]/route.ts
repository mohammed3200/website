// src/app/api/[[...route]]/route.ts
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import collaborator from "@/features/collaborators/server/route";
import innovators from "@/features/innovators/server/route";
import admin from "@/features/admin/server/route";
import strategicPlan from "@/features/strategic-plan/server/route";
import news from "@/features/news/server/route";
import pageContent from "@/features/page-content/server/route";
// import email from "@/features/email/server/route";


const app = new Hono().basePath("/api");

// Global middleware
app.use("/*", cors());
app.use("/*", logger());


// RESTful routes (existing)
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
const routes = app
  .route("/collaborator", collaborator)
  .route("/innovators", innovators)
  .route("/admin", admin)
  .route("/strategicPlan", strategicPlan)
  .route("/news", news)
  .route("/pageContent", pageContent);
// .route("/email", email);

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: "Internal error",
        data: process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      id: null,
    },
    500
  );
});

// 404 handler for RPC
app.notFound((c) => {
  if (c.req.path.includes("/rpc")) {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32601,
          message: "Method not found",
        },
        id: null,
      },
      404
    );
  }
  return c.json({ error: "Not Found" }, 404);
});

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;