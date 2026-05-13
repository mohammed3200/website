import { Faq } from "@/components/faq";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import type { Metadata } from "next";
import { sanitizeJsonForScript } from "@/lib/server-utils";
import { getSiteUrl } from "@/lib/env-utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const tMeta = await getTranslations({ locale, namespace: "Meta" });
    const siteUrl = getSiteUrl();
    const url = `${siteUrl}/${locale}/faq`;

    return {
        title: tMeta("faq.title"),
        description: tMeta("faq.description"),
        alternates: {
            canonical: url,
            languages: {
                ar: `${siteUrl}/ar/faq`,
                en: `${siteUrl}/en/faq`,
                'x-default': `${siteUrl}/faq`,
            },
        },
        openGraph: {
            title: tMeta("faq.title"),
            description: tMeta("faq.description"),
            url,
            locale: locale === 'ar' ? 'ar_LY' : 'en_US',
        },
    };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const isAr = locale === 'ar';
    const faqs = await db.fAQ.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": isAr ? faq.questionAr || faq.question : faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": isAr ? faq.answerAr || faq.answer : faq.answer
            }
        }))
    };

    const mappedFaqs = faqs.map((faq) => ({
        question_ar: faq.questionAr || faq.question,
        answer_ar: faq.answerAr || faq.answer,
        question_en: faq.question,
        answer_en: faq.answer
    }));

    return (
        <main className="min-h-screen pt-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: sanitizeJsonForScript(jsonLd) }}
            />
            <Faq initialData={mappedFaqs} />
        </main>
    );
}
