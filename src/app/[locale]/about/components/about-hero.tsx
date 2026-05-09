'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';

interface Props {
  locale: string;
  item: PageContent | null;
}

export function AboutHero({ locale, item }: Props) {
  const t = useTranslations('About.hero');
  const isArabic = locale === 'ar';

  const title = item
    ? isArabic
      ? item.titleAr?.trim() || item.titleEn?.trim() || t('title')
      : item.titleEn?.trim() || item.titleAr?.trim() || t('title')
    : t('title');

  const content = item
    ? isArabic
      ? item.contentAr ?? item.contentEn
      : item.contentEn ?? item.contentAr
    : null;

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-orange-50 to-white dark:from-primary/10 dark:via-stone-900 dark:to-stone-950 py-20 md:py-28"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Building2 className="w-4 h-4 text-primary" />
            <span className={`text-sm font-medium text-primary ${isArabic ? 'font-almarai' : 'font-outfit'}`}>
              {t('badge')}
            </span>
          </div>

          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight ${isArabic ? 'font-almarai' : 'font-outfit'}`}
          >
            {title}
          </h1>

          {content && (
            <p
              className={`text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed ${isArabic ? 'font-almarai' : 'font-outfit'}`}
            >
              {content}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
