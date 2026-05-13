'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Building2, Landmark, GraduationCap, Building } from 'lucide-react';

interface Props {
  locale: string;
  items: PageContent[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Landmark,
  GraduationCap,
  Building,
};

export function PartnersGrid({ locale, items }: Props) {
  const t = useTranslations('About.partners');
  const isArabic = locale === 'ar';
  const fontClass = isArabic ? 'font-almarai' : 'font-outfit';

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-neutral-900/50" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span className={cn('inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium', fontClass)}>
            {t('badge', { defaultMessage: 'Partner Network' })}
          </span>
          <h2 className={cn('text-3xl md:text-4xl font-bold text-gray-900 dark:text-white', fontClass)}>
            {t('title', { defaultMessage: 'Our Partners' })}
          </h2>
          <p className={cn('text-gray-600 dark:text-gray-400', fontClass)}>
            {t('subtitle', { defaultMessage: 'Institutions and organizations collaborating with us' })}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((partner, index) => {
            const Icon = (partner.icon ? iconMap[partner.icon] : null) ?? Building2;
            const partnerTitle = isArabic
              ? partner.titleAr ?? partner.titleEn
              : partner.titleEn ?? partner.titleAr;

            return (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-black/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon className="w-8 h-8 text-primary/70 group-hover:text-primary transition-colors" />
                </div>
                <h3 className={cn("text-lg font-semibold text-neutral-800 dark:text-neutral-100", fontClass)}>
                  {partnerTitle}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
