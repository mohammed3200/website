'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  GraduationCap,
  Lightbulb,
  Target,
  Users,
  Rocket,
  Award,
  Handshake,
  Mail,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface Props {
  locale: string;
  content: PageContent[];
}

export default function AboutClient({ locale, content }: Props) {
  const t = useTranslations('About');
  const router = useRouter();
  const isArabic = locale === 'ar';

  // Helper to get content by section
  const getSection = (section: string) => {
    return content
      .filter((item) => item.section === section)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  };

  // Localization helper
  const localized = (item: PageContent, field: 'title' | 'content') => {
    if (field === 'title') {
      return isArabic
        ? item.titleAr || item.titleEn
        : item.titleEn || item.titleAr;
    }
    return isArabic
      ? item.contentAr || item.contentEn
      : item.contentEn || item.contentAr;
  };

  // Icon map
  const iconMap: Record<string, any> = {
    Building2,
    GraduationCap,
    Lightbulb,
    Target,
    Users,
    Rocket,
    Award,
    Handshake,
    Mail,
    MapPin,
  };

  const heroContent = getSection('hero')[0];
  const goalsContent = getSection('goals');
  const platformContent = getSection('platform');
  const teamContent = getSection('team');
  const ctaContent = getSection('cta')[0];

  // Stagger animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section
      className="min-h-screen bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-stone-900"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-orange-50 to-white dark:from-primary/10 dark:via-stone-900 dark:to-stone-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:60px_60px] opacity-[0.15]" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t('badge')}
              </span>
            </div>

            <h1 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white leading-tight">
              {heroContent
                ? localized(heroContent, 'title')
                : t('title')}
            </h1>

            <p className="font-din-regular text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {heroContent
                ? localized(heroContent, 'content')
                : t('subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Goals Section */}
        {goalsContent.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-10"
          >
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <h2 className="font-din-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
                {t('goalsTitle')}
              </h2>
              <p className="font-din-regular text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('goalsSubtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goalsContent.map((goal, index) => {
                const Icon = (goal.icon ? iconMap[goal.icon] : null) ?? Target;
                return (
                  <motion.div
                    key={goal.id}
                    variants={itemVariants}
                    className="group p-6 bg-white dark:bg-stone-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-stone-100 dark:border-stone-700 hover:border-primary/30"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-din-bold text-xl mb-2 text-gray-900 dark:text-white">
                      {localized(goal, 'title')}
                    </h3>
                    <p className="font-din-regular text-gray-600 dark:text-gray-300 leading-relaxed">
                      {localized(goal, 'content')}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Platform Section */}
        {platformContent.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-10"
          >
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <h2 className="font-din-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
                {t('platformTitle')}
              </h2>
              <p className="font-din-regular text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('platformSubtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {platformContent.map((item, index) => {
                const Icon = (item.icon ? iconMap[item.icon] : null) ?? Rocket;
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="flex gap-4 p-6 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-stone-900 rounded-2xl border border-orange-100 dark:border-orange-900/30"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-din-bold text-lg mb-1 text-gray-900 dark:text-white">
                        {localized(item, 'title')}
                      </h3>
                      <p className="font-din-regular text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {localized(item, 'content')}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Team / Departments Section */}
        {teamContent.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="space-y-10"
          >
            <motion.div variants={itemVariants} className="text-center space-y-3">
              <h2 className="font-din-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
                {t('teamTitle')}
              </h2>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {teamContent.map((member) => {
                const Icon = (member.icon ? iconMap[member.icon] : null) ?? Users;
                return (
                  <motion.div
                    key={member.id}
                    variants={itemVariants}
                    className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-stone-800 rounded-full shadow-sm border border-stone-200 dark:border-stone-700 hover:border-primary/30 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="font-din-bold text-gray-900 dark:text-white">
                      {localized(member, 'title')}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Fallback: No DB content */}
        {content.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 space-y-6"
          >
            <Building2 className="w-16 h-16 text-primary/30 mx-auto" />
            <h2 className="font-din-bold text-2xl text-gray-900 dark:text-white">
              {t('title')}
            </h2>
            <p className="font-din-regular text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {t('subtitle')}
            </p>
          </motion.div>
        )}

        {/* CTA Section */}
        {ctaContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <button
              onClick={() => router.push(`/${locale}/contact`)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-din-bold text-lg rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {localized(ctaContent, 'title')}
              <ArrowRight className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
