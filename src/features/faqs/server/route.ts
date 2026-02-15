import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { cache } from "@/lib/cache";
import { faqSchema } from "../schemas";

const app = new Hono()
    // Public endpoint - only active FAQs
    .get('/public', async (c) => {
        try {
            const faqs = await db.fAQ.findMany({
                where: {
                    isActive: true,
                },
                select: {
                    id: true,
                    question: true,
                    answer: true,
                    questionAr: true,
                    answerAr: true,
                    category: true,
                    order: true,
                },
                orderBy: [
                    { isSticky: 'desc' },
                    { order: 'asc' },
                ],
            });

            // Transform to match the expected Faq type
            const transformedFaqs = faqs.map((faq: typeof faqs[0]) => ({
                id: faq.id,
                question_en: faq.question,
                answer_en: faq.answer,
                question_ar: faq.questionAr || faq.question,
                answer_ar: faq.answerAr || faq.answer,
                category: faq.category,
            }));

            return c.json({ data: transformedFaqs }, 200);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            return c.json(
                { code: 'SERVER_ERROR', message: 'Failed to fetch FAQs' },
                500,
            );
        }
    })


    // Admin: List all FAQs
    .get('/', async (c) => {
        try {
            const faqs = await db.fAQ.findMany({
                orderBy: [
                    { order: 'asc' },
                    { createdAt: 'desc' },
                ],
            });
            return c.json({ data: faqs }, 200);
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            return c.json({ code: 'SERVER_ERROR', message: 'Failed to fetch FAQs' }, 500);
        }
    })
    // Admin: Create FAQ
    .post(
        '/',
        zValidator('json', faqSchema((key) => key)),
        async (c) => {
            const data = c.req.valid('json');
            try {
                const faq = await db.fAQ.create({
                    data: {
                        question: data.question,
                        answer: data.answer,
                        questionAr: data.questionAr,
                        answerAr: data.answerAr,
                        category: data.category,
                        order: data.order,
                        isActive: data.isActive,
                        isSticky: data.isSticky,
                    },
                });

                // Invalidate cache
                await cache.del('faqs:public');

                return c.json({ data: faq, message: 'FAQ created successfully' }, 201);
            } catch (error) {
                console.error('Error creating FAQ:', error);
                return c.json({ code: 'SERVER_ERROR', message: 'Failed to create FAQ' }, 500);
            }
        }
    )
    // Admin: Update FAQ
    .patch(
        '/:id',
        zValidator('json', faqSchema((key) => key).partial()),
        async (c) => {
            const id = c.req.param('id');
            const data = c.req.valid('json');
            try {
                const faq = await db.fAQ.update({
                    where: { id },
                    data,
                });

                // Invalidate cache
                await cache.del('faqs:public');

                return c.json({ data: faq, message: 'FAQ updated successfully' }, 200);
            } catch (error) {
                console.error('Error updating FAQ:', error);
                return c.json({ code: 'SERVER_ERROR', message: 'Failed to update FAQ' }, 500);
            }
        }
    )
    // Admin: Delete FAQ
    .delete('/:id', async (c) => {
        const id = c.req.param('id');
        try {
            await db.fAQ.delete({
                where: { id },
            });

            // Invalidate cache
            await cache.del('faqs:public');

            return c.json({ message: 'FAQ deleted successfully' }, 200);
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            return c.json({ code: 'SERVER_ERROR', message: 'Failed to delete FAQ' }, 500);
        }
    });

export default app;
