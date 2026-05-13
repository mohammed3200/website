'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Rocket, Target, Lightbulb, Zap, Activity } from 'lucide-react';

interface Props {
  locale: string;
  items: PageContent[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Target,
  Lightbulb,
  Zap,
  Activity,
};

export function ApproachPillars({ locale, items }: Props) {
  const t = useTranslations('Entrepreneurship.approach');
  const isArabic = locale === 'ar';
  const fontClass = isArabic ? 'font-almarai' : 'font-outfit';

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-stone-900" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className={cn('inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-sm font-medium', fontClass)}>
            {t('badge', { defaultMessage: 'Our Approach' })}
          </span>
          <h2 className={cn('text-3xl md:text-4xl font-bold text-gray-900 dark:text-white', fontClass)}>
            {t('title', { defaultMessage: 'How We Work' })}
          </h2>
          <p className={cn('text-gray-600 dark:text-gray-400', fontClass)}>
            {t('subtitle', { defaultMessage: 'A systematic approach to fostering innovation' })}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {items.map((pillar, index) => {
            const Icon = (pillar.icon ? iconMap[pillar.icon] : null) ?? Zap;
            const title = isArabic
              ? pillar.titleAr ?? pillar.titleEn
              : pillar.titleEn ?? pillar.titleAr;
            const content = isArabic
              ? pillar.contentAr ?? pillar.contentEn
              : pillar.contentEn ?? pillar.contentAr;

            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative flex flex-col items-center text-center space-y-4 z-10"
              >
                {/* Connector Line (except for last item) */}
                {index < items.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] right-[-40%] h-[2px] bg-gradient-to-r from-orange-200 to-transparent dark:from-orange-800/50 -z-10" />
                )}
                
                <div className="w-24 h-24 rounded-full bg-white dark:bg-stone-800 shadow-xl flex items-center justify-center border-4 border-orange-50 dark:border-stone-700">
                  <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                
                <div className="pt-4 space-y-3">
                  <div className="inline-block px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-sm font-bold text-stone-500 dark:text-stone-400">
                    {index + 1}
                  </div>
                  <h3 className={cn("text-xl font-bold text-gray-900 dark:text-white", fontClass)}>
                    {title}
                  </h3>
                  {content && (
                    <p className={cn("text-gray-600 dark:text-gray-400 leading-relaxed", fontClass)}>
                      {content}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
