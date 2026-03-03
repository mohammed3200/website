'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMedia } from 'react-use';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
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

// Import logos
import CollegeLogo from '../../public/assets/icons/college.png';
import CenterLogo from '../../public/assets/icons/logo.svg';

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
  priority: string;
  status: string;
  isActive: boolean;
  publishedAt: string | null;
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
  const t = useTranslations('ui');
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
          <p className="text-red-500">Failed to load strategic plans</p>
        </div>
      </section>
    );
  }

  const allPlans = (data?.data || []) as StrategicPlanItem[];
  const strategics = allPlans.filter((plan) =>
    lang === 'ar'
      ? plan.slug.endsWith('-ar-1') || plan.slug.endsWith('-ar-2')
      : plan.slug.endsWith('-en-1') || plan.slug.endsWith('-en-2'),
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
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
            {isArabic ? 'خططنا الاستراتيجية' : 'Our Strategic Plans'}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-almarai mb-3">
          {isArabic ? 'رؤيتنا للمستقبل' : 'Vision for the Future'}
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {isArabic
            ? 'استكشف خططنا الاستراتيجية الشاملة لتطوير ريادة الأعمال والتعليم التقني'
            : 'Explore our comprehensive strategic plans for entrepreneurship and technical education development'
          }
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

          // Determine entity type
          const isCenter =
            strategic.slug.includes('-center-') ||
            strategic.slug.includes('-ebic-') ||
            strategic.slug.includes('مركز') ||
            strategic.slug.includes('incubator');

          const entityName = isCenter
            ? isArabic
              ? 'مركز الريادة وحاضنات الأعمال'
              : 'Entrepreneurship & Business Incubators Center'
            : isArabic
              ? 'كلية التقنية الصناعية - مصراتة'
              : 'College of Industrial Technology - Misurata';

          const LogoSrc = isCenter ? CenterLogo : CollegeLogo;
          const IconComponent = isCenter ? Sparkles : Building2;

          return (
            <motion.div
              key={strategic.id}
              variants={cardVariants}
              onClick={() => handleCardClick(index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              className={cn(
                "group relative bg-white rounded-3xl overflow-hidden cursor-pointer",
                "border-2 transition-all duration-500",
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
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white" />
                      )}
                    </motion.div>

                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                        <IconComponent className="w-3 h-3" />
                        {strategic.category || (isArabic ? 'خطة إستراتيجية' : 'Strategic Plan')}
                      </span>
                      <p className="text-xs text-gray-400 mt-2 font-medium">
                        {isArabic ? 'تم النشر:' : 'Published:'} {strategic.publishedAt
                          ? new Date(strategic.publishedAt).toLocaleDateString(isArabic ? 'ar-LY' : 'en-US', {
                            year: 'numeric',
                            month: 'short'
                          })
                          : '2024'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Priority Badge */}
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm",
                    strategic.priority === 'HIGH'
                      ? "bg-red-50 text-red-600 border border-red-100"
                      : strategic.priority === 'MEDIUM'
                        ? "bg-orange-50 text-orange-600 border border-orange-100"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                  )}>
                    {strategic.priority?.charAt(0) || 'P'}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">
                      {entityName}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 font-almarai leading-tight group-hover:text-primary transition-colors">
                      {strategic.title}
                    </h3>
                  </div>

                  {strategic.excerpt && (
                    <p className="text-gray-600 leading-relaxed line-clamp-3 font-din-regular">
                      {strategic.excerpt}
                    </p>
                  )}

                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: strategic.status === 'COMPLETED' ? '100%' : '65%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500">
                      {strategic.status === 'COMPLETED' ? '100%' : '65%'}
                    </span>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      strategic.status === 'ACTIVE' ? "bg-green-500" :
                        strategic.status === 'COMPLETED' ? "bg-blue-500" : "bg-amber-500"
                    )} />
                    <span className="text-sm font-medium text-gray-500">
                      {strategic.status === 'ACTIVE' ? (isArabic ? 'نشط' : 'Active') :
                        strategic.status === 'COMPLETED' ? (isArabic ? 'مكتمل' : 'Completed') :
                          (isArabic ? 'قيد التنفيذ' : 'In Progress')}
                    </span>
                  </div>

                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`${lang}/StrategicPlan/${strategic.slug}`);
                    }}
                    whileHover={{ scale: 1.05, x: isArabic ? -4 : 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all",
                      "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-500/25",
                      "hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-500 hover:to-orange-700"
                    )}
                  >
                    <span>{t('readMore')}</span>
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
          {isArabic ? 'هل تريد معرفة المزيد عن استراتيجيتنا؟' : 'Want to learn more about our strategy?'}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/${lang}/about`)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-full text-gray-700 font-bold hover:border-orange-300 hover:text-primary transition-all"
        >
          {isArabic ? 'استكشف المزيد' : 'Explore More'}
          {isArabic ? <ArrowUpLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
        </motion.button>
      </motion.div>
    </section>
  );
};
