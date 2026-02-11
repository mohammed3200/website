'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Award,
    BookOpen,
    Users,
    Target,
    TrendingUp,
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
        return content.filter((item) => item.section === section);
    };

    // Fallback icon map
    const iconMap: Record<string, any> = {
        BookOpen,
        Users,
        Target,
        TrendingUp,
        Award,
        Lightbulb,
        ArrowRight,
    };

    // Get hero content or use fallback
    const heroContent = getSection('hero')[0];
    const programsContent = getSection('programs');
    const valuesContent = getSection('values');
    const missionContent = getSection('mission')[0];
    const ctaContent = getSection('cta')[0];

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

                {/* Programs Grid */}
                {programsContent.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {programsContent.map((program, index) => {
                            const Icon = program.icon ? iconMap[program.icon] || Target : Target;
                            return (
                                <motion.div
                                    key={program.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 bg-white dark:bg-stone-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-700"
                                >
                                    <Icon className="w-12 h-12 text-orange-500 mb-4" />
                                    <h3 className="font-din-bold text-xl mb-2 text-gray-900 dark:text-white">
                                        {isArabic
                                            ? program.titleAr || program.titleEn
                                            : program.titleEn || program.titleAr}
                                    </h3>
                                    <p className="font-din-regular text-gray-600 dark:text-gray-300">
                                        {isArabic
                                            ? program.contentAr || program.contentEn
                                            : program.contentEn || program.contentAr}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    // Fallback programs
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: BookOpen, titleKey: 'workshops', descKey: 'workshopsDesc' },
                            { icon: Users, titleKey: 'mentorship', descKey: 'mentorshipDesc' },
                            { icon: Target, titleKey: 'strategic', descKey: 'strategicDesc' },
                            { icon: TrendingUp, titleKey: 'growth', descKey: 'growthDesc' },
                        ].map((program, index) => (
                            <motion.div
                                key={program.titleKey}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-white dark:bg-stone-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-700"
                            >
                                <program.icon className="w-12 h-12 text-orange-500 mb-4" />
                                <h3 className="font-din-bold text-xl mb-2 text-gray-900 dark:text-white">
                                    {t(program.titleKey)}
                                </h3>
                                <p className="font-din-regular text-gray-600 dark:text-gray-300">
                                    {t(program.descKey)}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Core Values */}
                {valuesContent.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {valuesContent.map((value) => {
                            const Icon = value.icon ? iconMap[value.icon] || Award : Award;
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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        {[
                            { icon: Award, labelKey: 'excellence' },
                            { icon: Lightbulb, labelKey: 'innovation' },
                            { icon: Users, labelKey: 'collaboration' },
                        ].map((value) => (
                            <div
                                key={value.labelKey}
                                className="flex items-center gap-3 px-6 py-3 bg-orange-50 dark:bg-orange-900/20 rounded-full border-2 border-orange-200 dark:border-orange-800"
                            >
                                <value.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                <span className="font-din-bold text-gray-900 dark:text-white">
                                    {t(value.labelKey)}
                                </span>
                            </div>
                        ))}
                    </motion.div>
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
