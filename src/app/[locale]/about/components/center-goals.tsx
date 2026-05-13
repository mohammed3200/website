'use client';

import React, { useMemo } from 'react';
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
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { cn } from '@/lib/utils';

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

/**
 * Calculates a visually pleasing Bento Grid layout where every row perfectly
 * sums up to 3 columns, ensuring there are no awkward empty gaps at the end of a row.
 */
function getBentoSpans(total: number): number[] {
  const spans: number[] = [];
  let remaining = total;
  
  while (remaining > 0) {
    if (remaining >= 3) {
      // Alternate row layouts to create the "bento" feel
      const rowPattern = spans.length % 4;
      if (rowPattern === 0) {
        spans.push(2, 1);
        remaining -= 2;
      } else if (rowPattern === 1 || rowPattern === 2) {
        spans.push(1, 1, 1);
        remaining -= 3;
      } else {
        spans.push(1, 2);
        remaining -= 2;
      }
    } else if (remaining === 2) {
      // If exactly 2 items remain, make them fill the row
      spans.push(2, 1);
      remaining -= 2;
    } else if (remaining === 1) {
      // If exactly 1 item remains, make it full width
      spans.push(3);
      remaining -= 1;
    }
  }
  return spans;
}

const spanToClass: Record<number, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
};

const GoalHeader = ({ Icon }: { Icon: React.ComponentType<{ className?: string }> }) => (
  <div className="flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-800 items-center justify-center border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden relative">
    <Icon className="w-16 h-16 text-neutral-300 dark:text-neutral-700 transition-transform duration-500 group-hover/bento:scale-110 group-hover/bento:rotate-[-5deg]" />
  </div>
);

export function CenterGoals({ locale, items }: Props) {
  const t = useTranslations('About.goals');
  const isArabic = locale === 'ar';
  const fontClass = isArabic ? 'font-almarai' : 'font-outfit';

  // Memoize spans so they don't recalculate on every render
  const spans = useMemo(() => getBentoSpans(items.length), [items.length]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 md:py-24 bg-background"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4 space-y-16">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <span
            className={cn(
              'inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium',
              fontClass,
            )}
          >
            {t('badge')}
          </span>
          <h2
            className={cn(
              'text-3xl md:text-4xl font-bold text-gray-900 dark:text-white',
              fontClass,
            )}
          >
            {t('title')}
          </h2>
          <p
            className={cn(
              'text-gray-600 dark:text-gray-400',
              fontClass,
            )}
          >
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <BentoGrid className="max-w-6xl mx-auto md:auto-rows-[22rem]">
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
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={cn('h-full', spanToClass[spans[index]])}
              >
                <BentoGridItem
                  className="h-full border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black/40 shadow-sm hover:shadow-lg transition-all"
                  title={
                    <span className={cn('text-lg font-semibold text-neutral-800 dark:text-neutral-100', fontClass)}>
                      {goalTitle}
                    </span>
                  }
                  description={
                    goalContent ? (
                      <span
                        className={cn(
                          'text-sm leading-relaxed text-neutral-500 dark:text-neutral-400',
                          fontClass,
                        )}
                      >
                        {goalContent}
                      </span>
                    ) : undefined
                  }
                  header={<GoalHeader Icon={Icon} />}
                  icon={<Icon className="w-5 h-5 text-primary" />}
                />
              </motion.div>
            );
          })}
        </BentoGrid>
      </div>
    </section>
  );
}
