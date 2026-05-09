'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    MessageSquare,
    DollarSign,
    BarChart3,
    Factory,
    ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';

interface Props {
    locale: string;
    content: PageContent[];
}

export default function IncubatorsClient({ locale, content }: Props) {
    const t = useTranslations('Incubators');
    const isArabic = locale === 'ar';

    const getSection = (section: string) => {
        return content
            .filter((item) => item.section === section)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    };

    const iconMap: Record<string, any> = {
        Building2,
        MessageSquare,
        DollarSign,
        BarChart3,
        Factory,
        ArrowRight,
    };

    const heroContent = getSection('hero')[0];
    const tasksContent = getSection('tasks');
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
            className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-stone-900"
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            <div className="container mx-auto px-4 space-y-16">
                {/* Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <h1 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-tight">
                        {localized(heroContent, 'title') ?? t('title')}
                    </h1>
                    <p className="font-din-regular text-lg md:text-xl text-gray-600 dark:text-gray-300">
                        {localized(heroContent, 'content') ?? t('subtitle')}
                    </p>
                </motion.div>

                {/* Tasks */}
                {tasksContent.length > 0 ? (
                    <ol className="space-y-6 max-w-4xl mx-auto" aria-label={t('incubatorTasks')}>
                        {tasksContent.map((task, index) => {
                            const Icon = (task.icon ? iconMap[task.icon] : null) ?? Building2;
                            return (
                                <motion.li
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group flex gap-5 p-6 md:p-8 bg-white dark:bg-stone-800 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 border border-blue-50 dark:border-blue-900/30"
                                >
                                    <div className="shrink-0 flex flex-col items-center gap-3">
                                        <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="font-din-bold text-2xl text-gray-300 dark:text-gray-600">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className="font-din-bold text-xl text-gray-900 dark:text-white leading-tight">
                                            {localized(task, 'title')}
                                        </h3>
                                        {(task.contentAr || task.contentEn) && (
                                            <p className="font-din-regular text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {localized(task, 'content')}
                                            </p>
                                        )}
                                    </div>
                                </motion.li>
                            );
                        })}
                    </ol>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400 dark:text-gray-500">
                            {t('emptyState')}
                        </p>
                    </div>
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
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-din-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
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
