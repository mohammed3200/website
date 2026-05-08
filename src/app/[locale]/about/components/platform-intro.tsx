'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';

interface Props {
  locale: string;
  item: PageContent | null;
}

export function PlatformIntro({ locale, item }: Props) {
  const t = useTranslations('About.platform');
  const isArabic = locale === 'ar';

  if (!item) {
    return null;
  }

  const title = isArabic
    ? item.titleAr ?? item.titleEn
    : item.titleEn ?? item.titleAr;
  const content = isArabic
    ? item.contentAr ?? item.contentEn
    : item.contentEn ?? item.contentAr;

  return (
    <section
      className="py-16 md:py-24 bg-gradient-to-br from-stone-50 to-white dark:from-stone-950 dark:to-stone-900"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
            <Network className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span
              className={`text-sm font-medium text-blue-600 dark:text-blue-400 ${isArabic ? 'font-almarai' : 'font-outfit'}`}
            >
              {t('badge')}
            </span>
          </div>

          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${isArabic ? 'font-almarai' : 'font-outfit'}`}
          >
            {title ?? t('title')}
          </h2>

          {content && (
            <p
              className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed ${isArabic ? 'font-almarai' : 'font-outfit'}`}
            >
              {content}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
