import { Hono } from "hono";
import { db } from "@/lib/db";
import { zValidator } from "@hono/zod-validator";
import { getLatestNewsSchema, getNewsByIdSchema, createNewsSchema, updateNewsSchema } from "../schemas";
import { verifyAuth, requirePermission } from "@/features/admin/server/middleware";
import { RESOURCES, ACTIONS } from "@/lib/rbac-base";
import type { Session } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { s3Service } from "@/lib/storage/s3-service";

type Variables = {
    user: Session['user'] & {
        id: string;
    };
};

const app = new Hono<{ Variables: Variables }>()
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

            const news = await db.news.findUnique({
                where: { id },
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
    )

    // Admin routes
    .get(
        "/",
        verifyAuth,
        requirePermission(RESOURCES.NEWS, ACTIONS.READ),
        async (c) => {
            const news = await db.news.findMany({
                orderBy: { createdAt: 'desc' },
                include: {
                    image: true,
                    createdBy: {
                        select: { name: true }
                    }
                }
            });

            return c.json({ data: news });
        }
    )
    .post(
        "/",
        verifyAuth,
        requirePermission(RESOURCES.NEWS, ACTIONS.MANAGE),
        zValidator("form", createNewsSchema),
        async (c) => {
            const user = c.get("user");
            const data = c.req.valid("form");
            const { image, ...rest } = data;

            let imageId: string | null = null;
            if (image instanceof File) {
                const imageBuffer = Buffer.from(await image.arrayBuffer());
                const imageKey = s3Service.generateKey('image', image.name, uuidv4());

                const { url, s3Key, bucket } = await s3Service.uploadFile(
                    imageBuffer,
                    imageKey,
                    image.type
                );

                const imageRecord = await db.image.create({
                    data: {
                        url,
                        s3Key,
                        s3Bucket: bucket,
                        mimeType: image.type,
                        size: image.size,
                        originalName: image.name,
                        filename: imageKey,
                    },
                });
                imageId = imageRecord.id;
            }

            const news = await db.news.create({
                data: {
                    ...rest,
                    publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : null,
                    imageId: imageId || rest.imageId,
                    createdById: user.id,
                    updatedById: user.id,
                    slug: rest.slug || uuidv4(),
                },
            });

            return c.json({ data: news });
        }
    )
    .patch(
        "/:id",
        verifyAuth,
        requirePermission(RESOURCES.NEWS, ACTIONS.MANAGE),
        zValidator("form", updateNewsSchema),
        async (c) => {
            const user = c.get("user");
            const id = c.req.param("id");
            const data = c.req.valid("form");
            const { image, ...rest } = data;

            // Fetch existing news to get old image info
            const existingNews = await db.news.findUnique({
                where: { id },
                include: { image: true }
            });

            if (!existingNews) {
                return c.json({ error: "News not found" }, 404);
            }

            let imageId: string | undefined = undefined;
            if (image instanceof File) {
                const imageBuffer = Buffer.from(await image.arrayBuffer());
                const imageKey = s3Service.generateKey('image', image.name, uuidv4());

                const { url, s3Key, bucket } = await s3Service.uploadFile(
                    imageBuffer,
                    imageKey,
                    image.type
                );

                const imageRecord = await db.image.create({
                    data: {
                        url,
                        s3Key,
                        s3Bucket: bucket,
                        mimeType: image.type,
                        size: image.size,
                        originalName: image.name,
                        filename: imageKey,
                    },
                });
                imageId = imageRecord.id;

                // Delete old image if it exists and a new one is uploaded
                if (existingNews.image && existingNews.image.s3Key) {
                    try {
                        await s3Service.deleteFile(existingNews.image.s3Key);
                        // We delete the old image record as it's no longer needed
                        await db.image.delete({ where: { id: existingNews.image.id } });
                    } catch (error) {
                        console.error("Failed to cleanup old image:", error);
                    }
                }
            }

            const news = await db.news.update({
                where: { id },
                data: {
                    ...rest,
                    publishedAt: rest.publishedAt ? new Date(rest.publishedAt) : (rest.publishedAt === null ? null : undefined),
                    imageId: imageId !== undefined ? imageId : (rest.imageId !== undefined ? rest.imageId : undefined),
                    updatedById: user.id,
                },
            });

            return c.json({ data: news });
        }
    )
    .delete(
        "/:id",
        verifyAuth,
        requirePermission(RESOURCES.NEWS, ACTIONS.MANAGE),
        async (c) => {
            const id = c.req.param("id");

            // Fetch news to get image info for cleanup
            const news = await db.news.findUnique({
                where: { id },
                include: { image: true }
            });

            if (!news) {
                return c.json({ error: "News not found" }, 404);
            }

            // Store image info before deleting news
            const oldImage = news.image;

            await db.news.delete({
                where: { id },
            });

            // Cleanup image if it exists
            if (oldImage && oldImage.s3Key) {
                try {
                    await s3Service.deleteFile(oldImage.s3Key);
                    await db.image.delete({ where: { id: oldImage.id } });
                } catch (error) {
                    console.error("Failed to cleanup image after deletion:", error);
                }
            }

            return c.json({ success: true });
        }
    );

export default app;
