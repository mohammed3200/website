'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';

import { Faqs } from '@/features/faqs';

import { MockFaqData } from '@/mock';
import { HelpCircle } from 'lucide-react';
import { useGetPublicFaqs } from '@/features/faqs/api/use-get-public-faqs';
import { config } from '@/lib/config';

import { HomeFaqSkeleton } from '@/components/skeletons';

export const Faq = () => {
  const t = useTranslations('Faq');
  const { isArabic } = useLanguage();
  const { data: realFaqs, isLoading } = useGetPublicFaqs();

  // Hybrid data strategy:
  // - In production: use real data only (show nothing if < threshold)
  // - In development: use mock data as fallback if real data < threshold
  const faqData = React.useMemo(() => {
    if (isLoading) return [];
    const realData = realFaqs || [];
    if (realData.length >= config.thresholds.faq) return realData;
    if (config.isProduction) return [];
    return MockFaqData;
  }, [realFaqs, isLoading]);

  if (isLoading) return <HomeFaqSkeleton />;
  if (faqData.length === 0) return null;

  return (
    <section dir={isArabic ? 'rtl' : 'ltr'} className="flex flex-col px-4">
      {/* Section Header */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-white border border-gray-100 rounded-xl shadow-sm mb-2">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-almarai text-foreground">
          {t('title')}
        </h2>
        <p className="text-gray-500 font-outfit text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="relative flex-1">
        <Faqs listOfFaq={faqData} />
      </div>
    </section>
  );
};
