import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { getLatestNewsSchema, getNewsByIdSchema } from "../schemas";

const app = new Hono()
    .get(
        "/latest",
        zValidator("query", getLatestNewsSchema),
        async (c) => {
            const { limit } = c.req.valid("query");

            const news = await db.news.findMany({
                where: { isActive: true },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    image: true
                }
            });

            return c.json({ data: news });
        }
    )
    .get(
        "/:id",
        zValidator("param", getNewsByIdSchema),
        async (c) => {
            const { id } = c.req.valid("param");

            const news = await db.news.findFirst({
                where: { id, isActive: true },
                include: {
                    image: true,
                    createdBy: {
                        select: { name: true, image: true }
                    }
                }
            });

            if (!news) {
                return c.json({ error: "News not found" }, 404);
            }

            return c.json({ data: news });
        }
    );

export default app;
