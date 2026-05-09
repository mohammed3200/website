'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Users,
  Rocket,
  TrendingUp,
  Handshake,
  Target,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PageContent } from '@prisma/client';

interface Props {
  locale: string;
  items: PageContent[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Users,
  Rocket,
  TrendingUp,
  Handshake,
};

export function CenterGoals({ locale, items }: Props) {
  const t = useTranslations('About.goals');
  const isArabic = locale === 'ar';

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 md:py-24 bg-background"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span
            className={`inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium ${isArabic ? 'font-almarai' : 'font-outfit'}`}
          >
            {t('badge')}
          </span>
          <h2
            className={`text-3xl md:text-4xl font-bold text-gray-900 dark:text-white ${isArabic ? 'font-almarai' : 'font-outfit'}`}
          >
            {t('title')}
          </h2>
          <p
            className={`text-gray-600 dark:text-gray-400 ${isArabic ? 'font-almarai' : 'font-outfit'}`}
          >
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((goal, index) => {
            const Icon = (goal.icon ? iconMap[goal.icon] : null) ?? Target;
            const goalTitle = isArabic
              ? goal.titleAr ?? goal.titleEn
              : goal.titleEn ?? goal.titleAr;
            const goalContent = isArabic
              ? goal.contentAr ?? goal.contentEn
              : goal.contentEn ?? goal.contentAr;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.07, duration: 0.5 }}
                className="group p-6 bg-white dark:bg-stone-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-stone-100 dark:border-stone-700 hover:border-primary/30"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3
                  className={`text-xl font-semibold mb-2 text-gray-900 dark:text-white ${isArabic ? 'font-almarai' : 'font-outfit'}`}
                >
                  {goalTitle}
                </h3>
                {goalContent && (
                  <p
                    className={`text-gray-600 dark:text-gray-300 leading-relaxed ${isArabic ? 'font-almarai' : 'font-outfit'}`}
                  >
                    {goalContent}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
