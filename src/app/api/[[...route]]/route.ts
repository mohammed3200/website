import { Hono } from "hono";
import { handle } from "hono/vercel";
import collaborator from "@/features/collaborators/server/route";
import innovators from "@/features/innovators/server/route";

const app = new Hono().basePath("/api");

// eslint-disable-next-line unused-imports/no-unused-vars
const routes = app
  .route("/collaborator", collaborator)
  .route("/innovators", innovators);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
