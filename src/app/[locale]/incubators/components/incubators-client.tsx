'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    MessageSquare,
    DollarSign,
    BarChart3,
    Factory,
    Lightbulb,
    Users,
    TrendingUp,
    Rocket,
    Target,
    Award,
    ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';

interface Props {
    locale: string;
    content: PageContent[];
}

export default function IncubatorsClient({ locale, content }: Props) {
    const t = useTranslations('Incubators');
    const isArabic = locale === 'ar';

    // Helper to get content by section
    const getSection = (section: string) => {
        return content
            .filter((item) => item.section === section)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    };

    // Icon map
    const iconMap: Record<string, any> = {
        Building2,
        MessageSquare,
        DollarSign,
        BarChart3,
        Factory,
        Lightbulb,
        Users,
        TrendingUp,
        Rocket,
        Target,
        Award,
        ArrowRight,
    };

    // Get content sections
    const tasksContent = getSection('tasks');
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
            className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950 dark:to-stone-900"
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            <div className="container mx-auto px-4 space-y-16">
                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-4xl mx-auto space-y-6"
                >
                    <h1 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-tight">
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

                {/* Incubator Tasks / Services Grid */}
                {tasksContent.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tasksContent.map((task, index) => {
                            const Icon = (task.icon ? iconMap[task.icon] : null) ?? Building2;
                            return (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group p-8 bg-white dark:bg-stone-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-50 dark:border-blue-900/30 overflow-hidden relative"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-500/10 transition-colors" />
                                    
                                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    
                                    <h3 className="font-din-bold text-xl mb-3 text-gray-900 dark:text-white leading-tight">
                                        {isArabic
                                            ? task.titleAr || task.titleEn
                                            : task.titleEn || task.titleAr}
                                    </h3>
                                    
                                    { (task.contentAr || task.contentEn) && (
                                        <p className="font-din-regular text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {isArabic
                                                ? task.contentAr || task.contentEn
                                                : task.contentEn || task.contentAr}
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

                {/* Resources Grid */}
                {resourcesContent.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resourcesContent.map((resource, index) => {
                            const Icon = (resource.icon ? iconMap[resource.icon] : null) ?? Users;
                            return (
                                <motion.div
                                    key={resource.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-stone-900 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                                >
                                    {Icon && <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />}
                                    <h4 className="font-din-bold text-lg mb-2 text-gray-900 dark:text-white">
                                        {isArabic
                                            ? resource.titleAr || resource.titleEn
                                            : resource.titleEn || resource.titleAr}
                                    </h4>
                                    <p className="font-din-regular text-sm text-gray-600 dark:text-gray-300">
                                        {isArabic
                                            ? resource.contentAr || resource.contentEn
                                            : resource.contentEn || resource.contentAr}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    // Fallback resources
                    <div className="text-center py-12">
                        <p className="text-gray-400 dark:text-gray-500">
                            {localizedEmptyState}
                        </p>
                    </div>
                )}

                {/* Success Metrics */}
                {metricsContent.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid md:grid-cols-3 gap-8 text-center"
                    >
                        {metricsContent.map((metric) => {
                            const metadataObj = metric.metadata as { number?: string | number } | null;
                            return (
                                <div key={metric.id} className="space-y-2">
                                    <div className="font-din-bold text-5xl text-blue-600 dark:text-blue-400">
                                        {metadataObj?.number || '0'}
                                    </div>
                                    <p className="font-din-bold text-xl text-gray-900 dark:text-white">
                                        {isArabic
                                            ? metric.titleAr || metric.titleEn
                                            : metric.titleEn || metric.titleAr}
                                    </p>
                                </div>
                            );
                        })}
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
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-din-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
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
