import { Hono } from "hono";
import { db } from "@/lib/db";

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
    });

export default app;
