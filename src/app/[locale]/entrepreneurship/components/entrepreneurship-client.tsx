'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Megaphone,
    Brain,
    Star,
    FlaskConical,
    GraduationCap,
    Target,
    Lightbulb,
    ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';

interface Props {
    locale: string;
    content: PageContent[];
}

export default function EntrepreneurshipClient({ locale, content }: Props) {
    const t = useTranslations('Entrepreneurship');
    const isArabic = locale === 'ar';

    // Helper to get content by section
    const getSection = (section: string) => {
        return content
            .filter((item) => item.section === section)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    };

    // Icon map
    const iconMap: Record<string, any> = {
        Megaphone,
        Brain,
        Lightbulb,
        GraduationCap,
        Star,
        FlaskConical,
        ArrowRight,
    };

    // Get content sections
    const goalsContent = getSection('goals');
    const heroContent = getSection('hero')[0];
    const emptyStateContent = getSection('emptyState')[0];

    const defaultEmptyState = t('emptyState') || 'No content available.';
    const localizedEmptyState = emptyStateContent
        ? (isArabic
            ? emptyStateContent.contentAr || emptyStateContent.titleAr || defaultEmptyState
            : emptyStateContent.contentEn || emptyStateContent.titleEn || defaultEmptyState)
        : defaultEmptyState;

    return (
        <section
            className="py-16 bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-stone-900"
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            <div className="container mx-auto px-4 space-y-16">
                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <h1 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white">
                        {heroContent
                            ? isArabic
                                ? heroContent.titleAr || heroContent.titleEn
                                : heroContent.titleEn || heroContent.titleAr
                            : t('title')}
                    </h1>
                    <p className="font-din-regular text-lg md:text-xl text-gray-600 dark:text-gray-300">
                        {heroContent
                            ? isArabic
                                ? heroContent.contentAr || heroContent.contentEn
                                : heroContent.contentEn || heroContent.contentAr
                            : t('subtitle')}
                    </p>
                </motion.div>

                {/* Goals Grid (The core content for this page) */}
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
                                        {isArabic
                                            ? goal.titleAr || goal.titleEn
                                            : goal.titleEn || goal.titleAr}
                                    </h3>
                                    {(goal.contentAr || goal.contentEn) && (
                                        <p className="font-din-regular text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {isArabic
                                                ? goal.contentAr || goal.contentEn
                                                : goal.contentEn || goal.contentAr}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400 dark:text-gray-500">
                            {localizedEmptyState}
                        </p>
                    </div>
                )}

                {/* Core Values */}
                {valuesContent.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {valuesContent.map((value, index) => {
                            const Icon = (value.icon ? iconMap[value.icon] : null) ?? Target;
                            return (
                                <div
                                    key={value.id}
                                    className="flex items-center gap-3 px-6 py-3 bg-orange-50 dark:bg-orange-900/20 rounded-full border-2 border-orange-200 dark:border-orange-800"
                                >
                                    <Icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                    <span className="font-din-bold text-gray-900 dark:text-white">
                                        {isArabic
                                            ? value.titleAr || value.titleEn
                                            : value.titleEn || value.titleAr}
                                    </span>
                                </div>
                            );
                        })}
                    </motion.div>
                ) : (
                    // Fallback values
                    <div className="text-center py-12">
                        <p className="text-gray-400 dark:text-gray-500">
                            {localizedEmptyState}
                        </p>
                    </div>
                )}

                {/* Mission Statement */}
                {missionContent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center p-8 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/20 dark:to-stone-900 rounded-3xl shadow-xl"
                    >
                        <h2 className="font-din-bold text-3xl mb-4 text-gray-900 dark:text-white">
                            {isArabic
                                ? missionContent.titleAr || missionContent.titleEn
                                : missionContent.titleEn || missionContent.titleAr}
                        </h2>
                        <p className="font-din-regular text-lg text-gray-700 dark:text-gray-300">
                            {isArabic
                                ? missionContent.contentAr || missionContent.contentEn
                                : missionContent.contentEn || missionContent.contentAr}
                        </p>
                    </motion.div>
                )}

                {/* CTA Section */}
                {ctaContent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <a
                            href={`/${locale}/registration`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-din-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {isArabic
                                ? ctaContent.titleAr || ctaContent.titleEn
                                : ctaContent.titleEn || ctaContent.titleAr}
                            <ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
                        </a>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
