'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMedia } from 'react-use';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Target,
  Building2,
  Sparkles
} from 'lucide-react';

import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';
import { useGetStrategicPlans } from '@/features/strategic-plan/api';
import { HomeStrategicPlanSkeleton } from '@/components/skeletons';

export interface StrategicPlanItem {
  id: string;
  slug: string;
  title: string;
  titleAr?: string | null;
  content: string;
  contentAr?: string | null;
  excerpt: string | null;
  excerptAr?: string | null;
  category: string | null;
  categoryAr?: string | null;
  isActive: boolean;
  publishedAt: string | null;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  image: {
    id: string;
    url: string;
    alt: string | null;
  } | null;
}

export const StrategicPlan = () => {
  const router = useRouter();
  const t = useTranslations('StrategicPlan');

  const { isArabic, lang } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const isDesktop = useMedia('(min-width: 640px)', true);

  const { data, isLoading, error } = useGetStrategicPlans();

  const handleCardClick = (index: number) => {
    if (!isDesktop) {
      setSelectedIndex(index);
    }
  };

  if (isLoading) {
    return <HomeStrategicPlanSkeleton />;
  }

  if (error || !data?.data) {
    return (
      <section className="max-w-7xl mx-auto w-full px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center">
          <p className="text-red-500">{t('loadError')}</p>
        </div>
      </section>
    );
  }

  const allPlans = (data?.data || []) as StrategicPlanItem[];
  // All plans are bilingual (EN+AR in single row) — show all active plans.
  // Language-specific display is handled by column selection below (titleAr vs title, etc.)
  const strategics = allPlans;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cubicBezierEasing = [0.22, 1, 0.36, 1] as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: cubicBezierEasing }
    }
  };

  return (
    <section className="max-w-7xl mx-auto w-full px-4" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-4">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary uppercase tracking-wider">
            {t('badge')}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-almarai mb-3">
          {t('title')}
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {strategics.map((strategic: StrategicPlanItem, index: number) => {
          const isSelected = selectedIndex === index;
          const isHovered = hoveredCard === index;

          // Localized content selection
          const displayTitle = isArabic ? (strategic.titleAr ?? strategic.title) : strategic.title;
          const displayExcerpt = isArabic ? (strategic.excerptAr ?? strategic.excerpt) : strategic.excerpt;

          // Determine entity type based on clean slug
          const isCenter = strategic.slug === 'ebic';
          
          const entityName = isCenter 
            ? (isArabic ? 'مركز ريادة الأعمال' : 'Entrepreneurship Center')
            : (isArabic ? 'كلية التقنية الصناعية' : 'College of Industrial Technology');

          const LogoSrc = isCenter ? '/assets/icons/logo.svg' : '/assets/icons/college.png';
          // Use string paths for logos to avoid TSC errors with relative public imports
          const IconComponent = isCenter ? Sparkles : Building2;

          // Date logic
          const startDate = strategic.startDate ? new Date(strategic.startDate).getFullYear() : null;
          const endDate = strategic.endDate ? new Date(strategic.endDate).getFullYear() : null;
          
          let displayDate = '';
          if (startDate && endDate) {
            displayDate = t('dateRange', { start: startDate, end: endDate });
          } else {
            const publishedDate = strategic.publishedAt ? new Date(strategic.publishedAt) : null;
            const isValidDate = publishedDate && !isNaN(publishedDate.getTime());
            displayDate = isValidDate
              ? publishedDate.toLocaleDateString(isArabic ? 'ar-LY' : 'en-US', {
                year: 'numeric'
              })
              : new Date().getFullYear().toString();
          }

          return (
            <motion.div
              key={strategic.id}
              variants={cardVariants}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              className={cn(
                "group relative bg-white rounded-3xl overflow-hidden cursor-pointer",
                "border-2 transition-all duration-500",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4",
                isDesktop || isSelected
                  ? "border-orange-200 shadow-xl shadow-orange-500/10 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-300"
                  : "border-gray-100 shadow-md opacity-80 scale-95",
                "hover:-translate-y-1"
              )}
            >
              {/* Top Accent Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600" />

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent" />
              </div>

              <div className="relative p-8 md:p-10 h-full flex flex-col min-h-[400px]">
                {/* Header with Logo */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    {/* Logo Container */}
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      className={cn(
                        "relative w-20 h-20 rounded-2xl flex items-center justify-center p-3 shadow-lg transition-shadow",
                        isCenter
                          ? "bg-gradient-to-br from-slate-50 to-slate-100 shadow-slate-200"
                          : "bg-gradient-to-br from-orange-50 to-orange-100 shadow-orange-200"
                      )}
                    >
                      <Image
                        src={LogoSrc}
                        alt={isCenter ? 'Center Logo' : 'College Logo'}
                        width={60}
                        height={60}
                        className="object-contain w-full h-full"
                      />

                      {/* Decorative corner accent for center logo */}
                      {isCenter && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-orange-200 shadow-sm" />
                      )}
                    </motion.div>

                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <IconComponent className="w-3 h-3" />
                        {entityName}
                      </span>
                      <p className="text-xs text-gray-400 mt-2 font-medium">
                        {displayDate}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-almarai leading-tight group-hover:text-primary transition-colors">
                      {displayTitle}
                    </h3>
                  </div>

                  {displayExcerpt && (
                    <p className="text-gray-600 leading-relaxed line-clamp-3 font-din-regular">
                      {displayExcerpt}
                    </p>
                  )}

                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/${lang}/StrategicPlan/${strategic.slug}`);
                    }}
                    whileHover={{ scale: 1.05, x: isArabic ? -4 : 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                      "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/25",
                      "hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-500 hover:to-orange-700"
                    )}
                  >
                    <span>{t('viewPlan')}</span>
                    {isArabic ? (
                      <ArrowUpLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </motion.button>
                </div>

                {/* Hover Glow Effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 1 : 0 }}
                  className="absolute -inset-px bg-gradient-to-r from-orange-400/20 to-orange-600/20 rounded-3xl blur-xl -z-10"
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500 mb-4">
          {t('ctaQuestion')}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/${lang}/about`)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-full text-gray-700 font-bold hover:border-orange-300 hover:text-primary transition-all"
        >
          {t('ctaButton')}
          {isArabic ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </motion.button>
      </motion.div>
    </section>
  );
};
