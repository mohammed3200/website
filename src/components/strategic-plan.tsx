'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowUpLeft, ArrowUpRight, Target, Building2, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';
import useLanguage from '@/hooks/use-language';
import { useGetStrategicPlans } from '@/features/strategic-plan/api';
import { HomeStrategicPlanSkeleton } from '@/components/skeletons';

// ─── Type ─────────────────────────────────────────────────────────────────────

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
  status: string;
  isActive: boolean;
  publishedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
  phase?: string | null;
  phaseAr?: string | null;
  entityType?: 'CENTER' | 'COLLEGE';
  image: {
    id: string;
    url: string | null;
    alt: string | null;
  } | null;
}

// ─── Animation Tokens ─────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const isPublished = status === 'PUBLISHED';
  return (
    <span
      className={cn(
        'inline-flex w-2 h-2 rounded-full',
        isPublished ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400',
      )}
      aria-hidden="true"
    />
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface PlanCardProps {
  plan: StrategicPlanItem;
  isArabic: boolean;
  lang: string;
  tUi: ReturnType<typeof useTranslations>;
  t: ReturnType<typeof useTranslations>;
}

function PlanCard({ plan, isArabic, lang, tUi, t }: PlanCardProps) {
  const router = useRouter();

  const displayTitle = isArabic ? (plan.titleAr ?? plan.title) : plan.title;
  const displayCategory = isArabic ? (plan.categoryAr ?? plan.category) : plan.category;
  const displayExcerpt = isArabic ? (plan.excerptAr ?? plan.excerpt) : plan.excerpt;

  // Entity type — explicit field beats slug heuristic
  const isCenter =
    plan.entityType === 'CENTER' ||
    (!plan.entityType &&
      (plan.slug.includes('-center-') ||
        plan.slug.includes('-ebic-') ||
        plan.slug.includes('incubator')));

  const LogoSrc = isCenter ? '/assets/icons/logo.svg' : '/assets/icons/college.png';
  const EntityIcon = isCenter ? Sparkles : Building2;

  const publishedDate = plan.publishedAt ? new Date(plan.publishedAt) : null;
  const isValidDate = publishedDate !== null && !isNaN(publishedDate.getTime());
  const displayDate = isValidDate
    ? publishedDate.toLocaleDateString(isArabic ? 'ar-LY' : 'en-US', {
        year: 'numeric',
        month: 'short',
      })
    : new Date().getFullYear().toString();

  const handleNavigate = () => router.push(`/${lang}/StrategicPlan/${plan.slug}`);

  return (
    <motion.article
      variants={cardVariants}
      className={cn(
        'group relative bg-white rounded-3xl overflow-hidden cursor-pointer',
        'border-2 border-orange-100',
        'shadow-lg shadow-orange-500/5',
        'transition-all duration-500',
        'hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/15 hover:-translate-y-1',
        'focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-4',
      )}
      role="article"
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
        aria-hidden="true"
      />

      <div className="relative p-8 md:p-10 flex flex-col gap-6 min-h-[360px]">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.04, rotate: 1.5 }}
            transition={{ duration: 0.25 }}
            className={cn(
              'relative w-16 h-16 rounded-2xl flex items-center justify-center p-2.5 shadow-md flex-shrink-0',
              isCenter
                ? 'bg-gradient-to-br from-slate-50 to-slate-100'
                : 'bg-gradient-to-br from-orange-50 to-orange-100',
            )}
            aria-hidden="true"
          >
            <Image
              src={LogoSrc}
              alt=""
              width={48}
              height={48}
              className="object-contain w-full h-full"
            />
          </motion.div>

          {/* Category + Date */}
          <div className="flex flex-col items-end gap-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
              <EntityIcon className="w-3 h-3" aria-hidden="true" />
              {displayCategory || t('defaultCategory')}
            </span>
            <time className="text-xs text-gray-400 font-medium">{displayDate}</time>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="flex-1 flex flex-col gap-2">
          <h3 className="text-2xl font-bold text-gray-900 font-almarai leading-tight group-hover:text-primary transition-colors duration-300">
            {displayTitle}
          </h3>
          {displayExcerpt && (
            <p className="text-gray-500 leading-relaxed line-clamp-3 text-sm font-din-regular">
              {displayExcerpt}
            </p>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          {/* Status indicator */}
          <div className="flex items-center gap-2">
            <StatusDot status={plan.status} />
            <span className="text-sm font-medium text-gray-500">
              {plan.status === 'PUBLISHED' ? t('statusActive') : t('statusInProgress')}
            </span>
          </div>

          {/* CTA */}
          <motion.button
            onClick={handleNavigate}
            whileHover={{ scale: 1.04, x: isArabic ? -3 : 3 }}
            whileTap={{ scale: 0.96 }}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm',
              'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
              'shadow-md shadow-orange-500/20',
              'hover:shadow-lg hover:shadow-orange-500/35 transition-shadow duration-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
            )}
            aria-label={`${tUi('readMore')} — ${displayTitle}`}
          >
            <span>{tUi('readMore')}</span>
            {isArabic ? (
              <ArrowUpLeft className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            )}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export const StrategicPlan = () => {
  const t = useTranslations('StrategicPlan');
  const tUi = useTranslations('ui');
  const { isArabic, lang } = useLanguage();
  const router = useRouter();

  const { data, isLoading, error } = useGetStrategicPlans();

  if (isLoading) return <HomeStrategicPlanSkeleton />;

  if (error || !data?.data) {
    return (
      <section className="max-w-7xl mx-auto w-full px-4" aria-label="Strategic Plans">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 text-center">
          <p className="text-red-500">{t('loadError')}</p>
        </div>
      </section>
    );
  }

  // Filter to only published plans (status-driven, not slug-suffix-driven)
  const plans = (data.data as StrategicPlanItem[]).filter(
    (plan) => plan.status === 'PUBLISHED' && plan.isActive,
  );

  return (
    <section
      className="max-w-7xl mx-auto w-full px-4"
      dir={isArabic ? 'rtl' : 'ltr'}
      aria-labelledby="strategic-plans-heading"
    >
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-full mb-4">
          <Target className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-bold text-primary uppercase tracking-wider">
            {t('badge')}
          </span>
        </div>
        <h2
          id="strategic-plans-heading"
          className="text-3xl md:text-4xl font-bold text-gray-900 font-almarai mb-3"
        >
          {t('title')}
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-base leading-relaxed">
          {t('subtitle')}
        </p>
      </motion.div>

      {/* Cards */}
      {plans.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          {t('noPlans')}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isArabic={isArabic}
              lang={lang}
              tUi={tUi}
              t={t}
            />
          ))}
        </motion.div>
      )}

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
        className="mt-12 text-center"
      >
        <p className="text-gray-500 mb-4 text-sm">{t('ctaQuestion')}</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/${lang}/about`)}
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm',
            'bg-white border-2 border-gray-200 text-gray-700',
            'hover:border-orange-300 hover:text-primary',
            'transition-colors duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
          )}
        >
          {t('ctaButton')}
          {isArabic ? (
            <ArrowUpLeft className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          )}
        </motion.button>
      </motion.div>
    </section>
  );
};
