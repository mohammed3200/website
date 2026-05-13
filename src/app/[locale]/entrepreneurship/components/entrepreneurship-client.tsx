'use client';

import { motion } from 'framer-motion';
import {
    Megaphone,
    Brain,
    Sparkles,
    FlaskConical,
    GraduationCap,
    Lightbulb,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';
import { ApproachPillars } from './approach-pillars';

interface Props {
    locale: string;
    content: PageContent[];
}

export default function EntrepreneurshipClient({ locale, content }: Props) {
    const t = useTranslations('Entrepreneurship');
    const isArabic = locale === 'ar';

    const getSection = (section: string) => {
        return content
            .filter((item) => item.section === section)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    };

    const iconMap: Record<string, any> = {
        Megaphone,
        Brain,
        Lightbulb,
        GraduationCap,
        Sparkles,
        FlaskConical,
        ArrowRight,
    };

    const heroContent = getSection('hero')[0];
    const goalsContent = getSection('goals');
    const approachContent = getSection('approach');
    const ctaContent = getSection('cta')[0];

    const localized = (item: PageContent | undefined, field: 'title' | 'content') => {
        if (!item) return undefined;
        if (field === 'title') {
            return isArabic ? (item.titleAr ?? item.titleEn) : (item.titleEn ?? item.titleAr);
        }
        return isArabic ? (item.contentAr ?? item.contentEn) : (item.contentEn ?? item.contentAr);
    };

    return (
        <section
            className="py-16 bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-stone-900"
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            <div className="container mx-auto px-4 space-y-16">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <h1 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white">
                        {localized(heroContent, 'title') ?? t('title')}
                    </h1>
                    <p className="font-din-regular text-lg md:text-xl text-gray-600 dark:text-gray-300">
                        {localized(heroContent, 'content') ?? t('subtitle')}
                    </p>
                </motion.div>

                {/* Goals */}
                {goalsContent.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {goalsContent.map((goal, index) => {
                            const Icon = (goal.icon ? iconMap[goal.icon] : null) ?? Lightbulb;
                            return (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-8 bg-white dark:bg-stone-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-stone-100 dark:border-stone-700 group"
                                >
                                    <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h3 className="font-din-bold text-xl mb-3 text-gray-900 dark:text-white leading-tight">
                                        {localized(goal, 'title')}
                                    </h3>
                                    {(goal.contentAr || goal.contentEn) && (
                                        <p className="font-din-regular text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {localized(goal, 'content')}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400 dark:text-gray-500">
                            {t('emptyState')}
                        </p>
                    </div>
                )}

                {/* Approach */}
                {approachContent.length > 0 && (
                    <ApproachPillars locale={locale} items={approachContent} />
                )}

                {/* CTA */}
                {ctaContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-2xl mx-auto space-y-6"
                    >
                        <h2 className="font-din-bold text-2xl md:text-3xl text-gray-900 dark:text-white">
                            {localized(ctaContent, 'title')}
                        </h2>
                        {(ctaContent.contentAr || ctaContent.contentEn) && (
                            <p className="font-din-regular text-lg text-gray-600 dark:text-gray-300">
                                {localized(ctaContent, 'content')}
                            </p>
                        )}
                        <Link
                            href={`/${locale}/innovators`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-din-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {localized(ctaContent, 'title')}
                            <ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
