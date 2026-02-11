'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
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
        return content.filter((item) => item.section === section);
    };

    // Fallback icon map
    const iconMap: Record<string, any> = {
        Lightbulb,
        Users,
        TrendingUp,
        Rocket,
        Target,
        Award,
        ArrowRight,
    };

    // Get content sections
    const heroContent = getSection('hero')[0];
    const phasesContent = getSection('phases');
    const resourcesContent = getSection('resources');
    const metricsContent = getSection('metrics');
    const ctaContent = getSection('cta')[0];

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

                {/* Incubation Phases */}
                {phasesContent.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {phasesContent.map((phase, index) => {
                            const Icon = iconMap[phase.icon || ''] ?? Lightbulb;
                            return (
                                <motion.div
                                    key={phase.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.15 }}
                                    className="relative p-8 bg-white dark:bg-stone-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 dark:border-blue-900"
                                >
                                    <div className="absolute -top-6 left-8 bg-blue-600 dark:bg-blue-500 rounded-full p-4 shadow-lg">
                                        {Icon && <Icon className="w-8 h-8 text-white" />}
                                    </div>
                                    <h3 className="font-din-bold text-2xl mb-3 mt-6 text-gray-900 dark:text-white">
                                        {isArabic
                                            ? phase.titleAr || phase.titleEn
                                            : phase.titleEn || phase.titleAr}
                                    </h3>
                                    <p className="font-din-regular text-gray-600 dark:text-gray-300">
                                        {isArabic
                                            ? phase.contentAr || phase.contentEn
                                            : phase.contentEn || phase.contentAr}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    // Fallback phases
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Lightbulb, titleKey: 'ideation', descKey: 'ideationDesc' },
                            { icon: Rocket, titleKey: 'development', descKey: 'developmentDesc' },
                            { icon: TrendingUp, titleKey: 'scaling', descKey: 'scalingDesc' },
                        ].map((phase, index) => (
                            <motion.div
                                key={phase.titleKey}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.15 }}
                                className="relative p-8 bg-white dark:bg-stone-800 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 dark:border-blue-900"
                            >
                                <div className="absolute -top-6 left-8 bg-blue-600 dark:bg-blue-500 rounded-full p-4 shadow-lg">
                                    <phase.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-din-bold text-2xl mb-3 mt-6 text-gray-900 dark:text-white">
                                    {t(phase.titleKey)}
                                </h3>
                                <p className="font-din-regular text-gray-600 dark:text-gray-300">
                                    {t(phase.descKey)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Resources Grid */}
                {resourcesContent.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {resourcesContent.map((resource, index) => {
                            const Icon = iconMap[resource.icon || ''] ?? Users;
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
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Users, titleKey: 'mentorship', descKey: 'mentorshipDesc' },
                            { icon: Target, titleKey: 'workspace', descKey: 'workspaceDesc' },
                            { icon: TrendingUp, titleKey: 'funding', descKey: 'fundingDesc' },
                            { icon: Award, titleKey: 'networking', descKey: 'networkingDesc' },
                        ].map((resource, index) => (
                            <motion.div
                                key={resource.titleKey}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-stone-900 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
                            >
                                <resource.icon className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
                                <h4 className="font-din-bold text-lg mb-2 text-gray-900 dark:text-white">
                                    {t(resource.titleKey)}
                                </h4>
                                <p className="font-din-regular text-sm text-gray-600 dark:text-gray-300">
                                    {t(resource.descKey)}
                                </p>
                            </motion.div>
                        ))}
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
