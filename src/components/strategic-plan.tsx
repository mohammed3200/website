'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMedia } from 'react-use';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';

import useLanguage from '@/hooks/use-language';
import { useGetStrategicPlans } from '@/features/strategic-plan/api';

import { WobbleCard } from './ui/wobble-card';
import { ActiveButton } from '@/components/buttons';
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
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto w-full md:border-2 md:border-primary rounded-3xl p-4 overflow-hidden">
        <div className="col-span-2 text-center py-8">
          <p className="text-red-500">Failed to load strategic plans</p>
        </div>
      </section>
    );
  }

  // Filter plans based on current language by slug suffix
  const allPlans = (data?.data || []) as StrategicPlanItem[];
  const strategics = allPlans.filter((plan) =>
    lang === 'ar'
      ? plan.slug.endsWith('-ar-1') || plan.slug.endsWith('-ar-2')
      : plan.slug.endsWith('-en-1') || plan.slug.endsWith('-en-2'),
  );

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl
       mx-auto w-full md:border-2 md:border-primary/20
        rounded-3xl p-6 overflow-hidden bg-neutral-50/50"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {strategics.map((strategic: StrategicPlanItem, index: number) => {
        const isSelected = selectedIndex === index;

        // Determine if this is the Center or College plan based on the slug
        const isCenter =
          strategic.slug.includes('-center-') ||
          strategic.slug.includes('-ebic-') ||
          strategic.slug.includes('مركز') ||
          strategic.slug.includes('incubator');

        // Full entity names based on language
        const entityName = isCenter
          ? isArabic
            ? 'مركز الريادة وحاضنات الأعمال'
            : 'Entrepreneurship and Business Incubators Center'
          : isArabic
            ? 'كلية التقنية الصناعية - مصراتة'
            : 'College of Industrial Technology - Misurata';

        // Distinct styling for each entity
        const containerStyle = isCenter
          ? 'bg-gradient-to-br from-orange-500 to-primary text-white shadow-lg shadow-orange-500/30 border border-orange-400/50'
          : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg shadow-slate-900/40 border border-slate-700/50';

        const buttonStyle = isCenter
          ? 'bg-white text-primary hover:bg-orange-50'
          : 'bg-primary text-white hover:bg-orange-600';

        // Custom icon color for the button inside the Center card
        const buttonTextColor = isCenter ? 'text-primary' : 'text-white';

        return (
          <WobbleCard
            key={strategic.id}
            onClick={() => handleCardClick(index)}
            containerClassName={`col-span-1 h-full min-h-[350px] transition-all duration-300 ${
              isDesktop || isSelected
                ? containerStyle
                : 'bg-white text-slate-800 border-2 border-primary/20 shadow-md opacity-70 scale-95'
            }`}
            className="grid grid-rows-[auto_1fr_auto] h-full
            md:px-10 px-6 py-8 max-md:rounded-3xl overflow-hidden relative group"
          >
            {/* Background watermark effect */}
            <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
              {isCenter ? (
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2L2 22h20L12 2z" />
                </svg>
              ) : (
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" />
                </svg>
              )}
            </div>

            <div className="flex justify-between items-start gap-4 mb-6 z-10">
              <div
                className={`px-4 py-1.5 rounded-full text-xs font-din-bold tracking-wider uppercase border backdrop-blur-sm ${
                  isCenter
                    ? 'bg-white/20 border-white/30 text-white'
                    : 'bg-primary/20 border-primary/30 text-orange-200'
                }`}
              >
                {strategic.category ||
                  (isArabic ? 'خطة إستراتيجية' : 'Strategic Plan')}
              </div>

              {strategic.image && (
                <div className="bg-white p-2 rounded-2xl shadow-sm relative z-10">
                  <Image
                    src={strategic.image.url}
                    width={60}
                    height={60}
                    className="size-16 object-contain"
                    alt={strategic.image.alt || strategic.title}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-3 z-10 mb-8">
              <h3
                className={`font-din-bold ${isDesktop ? 'text-lg' : 'text-base'} opacity-90 leading-tight`}
              >
                {entityName}
              </h3>
              <h2
                className={`font-din-bold ${isDesktop ? 'text-3xl' : 'text-2xl'} leading-tight`}
              >
                {strategic.title}
              </h2>
              {strategic.excerpt && (
                <p
                  className={`font-din-regular text-sm line-clamp-2 mt-2 ${isCenter ? 'text-orange-100' : 'text-slate-300'}`}
                >
                  {strategic.excerpt}
                </p>
              )}
            </div>

            <div className="w-full mt-auto z-10">
              <ActiveButton
                onClick={(e) => {
                  e?.stopPropagation();
                  router.push(`${lang}/StrategicPlan/${strategic.slug}`);
                }}
                className={`group-hover:translate-x-1 transition-transform border-none shadow-md ${buttonStyle} ${isArabic ? 'ml-auto' : 'mr-auto'}`}
              >
                <div className="flex items-center gap-2">
                  <p className={`font-din-bold text-base ${buttonTextColor}`}>
                    {t('readMore')}
                  </p>
                  {isArabic ? (
                    <ArrowUpLeft className={`size-5 ${buttonTextColor}`} />
                  ) : (
                    <ArrowUpRight className={`size-5 ${buttonTextColor}`} />
                  )}
                </div>
              </ActiveButton>
            </div>
          </WobbleCard>
        );
      })}
    </section>
  );
};
