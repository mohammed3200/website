'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';

interface Props {
  locale: string;
  item: PageContent;
}

export function AboutNews({ locale, item }: Props) {
  const t = useTranslations('About.news');
  const isArabic = locale === 'ar';

  const title = isArabic
    ? item.titleAr ?? item.titleEn
    : item.titleEn ?? item.titleAr;
  const content = isArabic
    ? item.contentAr ?? item.contentEn
    : item.contentEn ?? item.contentAr;

  return (
    <section
      className="py-16 md:py-24 bg-background"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto p-8 md:p-10 bg-white dark:bg-stone-800 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <span
              className={`px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium ${isArabic ? 'font-almarai' : 'font-outfit'}`}
            >
              {t('badge')}
            </span>
          </div>

          <h2
            className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 ${isArabic ? 'font-almarai' : 'font-outfit'}`}
          >
            {title ?? t('title')}
          </h2>

          {content && (
            <p
              className={`text-gray-700 dark:text-gray-300 leading-loose whitespace-pre-line ${isArabic ? 'font-almarai' : 'font-outfit'}`}
            >
              {content}
            </p>
          )}
        </motion.article>
      </div>
    </section>
  );
}
