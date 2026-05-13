'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Handshake, FileText, Briefcase, FileSignature } from 'lucide-react';

interface Props {
  locale: string;
  items: PageContent[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Handshake,
  FileText,
  Briefcase,
  FileSignature,
};

export function AgreementsList({ locale, items }: Props) {
  const t = useTranslations('About.agreements');
  const isArabic = locale === 'ar';
  const fontClass = isArabic ? 'font-almarai' : 'font-outfit';

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-background" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className={cn('inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium', fontClass)}>
            {t('badge', { defaultMessage: 'Collaborations' })}
          </span>
          <h2 className={cn('text-3xl md:text-4xl font-bold text-gray-900 dark:text-white', fontClass)}>
            {t('title', { defaultMessage: 'Agreements & Partnerships' })}
          </h2>
          <p className={cn('text-gray-600 dark:text-gray-400', fontClass)}>
            {t('subtitle', { defaultMessage: 'Formal partnerships supporting our mission' })}
          </p>
        </motion.div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {items.map((agreement, index) => {
            const Icon = (agreement.icon ? iconMap[agreement.icon] : null) ?? FileSignature;
            const title = isArabic
              ? agreement.titleAr ?? agreement.titleEn
              : agreement.titleEn ?? agreement.titleAr;
            const content = isArabic
              ? agreement.contentAr ?? agreement.contentEn
              : agreement.contentEn ?? agreement.contentAr;

            return (
              <motion.div
                key={agreement.id}
                initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-start gap-4 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className={cn("text-xl font-semibold text-neutral-900 dark:text-neutral-100", fontClass)}>
                    {title}
                  </h3>
                  {content && (
                    <p className={cn("text-neutral-600 dark:text-neutral-400 leading-relaxed", fontClass)}>
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
