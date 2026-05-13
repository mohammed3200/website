import { Faq } from "@/components/faq";
import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const tMeta = await getTranslations({ locale, namespace: "Meta" });
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/faq`;

    return {
        title: tMeta("faq.title"),
        description: tMeta("faq.description"),
        alternates: {
            canonical: url,
            languages: {
                ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/faq`,
                en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/faq`,
                'x-default': url,
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
    const faqs = await db.faq.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": isAr ? faq.questionAr || faq.question : faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": isAr ? faq.answerAr || faq.answer : faq.answer
            }
        }))
    };

    return (
        <main className="min-h-screen pt-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Faq />
        </main>
    );
}
