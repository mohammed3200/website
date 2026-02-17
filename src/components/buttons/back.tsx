'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface BackProps {
  className?: string;
  variant?: 'ghost' | 'outline' | 'solid';
  showLabel?: boolean;
}

export const Back = ({
  className,
  variant = 'ghost',
  showLabel = true,
}: BackProps) => {
  const router = useRouter();
  const t = useTranslations('ui');
  const { isArabic } = useLanguage();

  const variants = {
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-900',
    outline:
      'bg-transparent border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 text-gray-700',
    solid:
      'bg-white shadow-md hover:shadow-lg text-gray-900 border border-gray-100',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        className={cn(
          'group relative overflow-hidden rounded-xl transition-all duration-300',
          'flex items-center gap-2 px-4 py-2.5 h-auto',
          variants[variant],
          className,
        )}
        onClick={() => router.back()}
      >
        {/* Hover Background Animation */}
        <div
          className={cn(
            'absolute inset-0 bg-orange-50 -z-10 transition-transform duration-300 ease-spring',
            isArabic
              ? 'translate-x-full group-hover:translate-x-0'
              : '-translate-x-full group-hover:translate-x-0',
          )}
        />

        <motion.div
          className="flex items-center gap-2"
          whileHover={{ x: isArabic ? 2 : -2 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          {isArabic ? (
            <ArrowRight className="size-4 md:size-5 transition-transform group-hover:translate-x-1" />
          ) : (
            <ArrowLeft className="size-4 md:size-5 transition-transform group-hover:-translate-x-1" />
          )}

          {showLabel && (
            <span className="font-din-bold text-sm md:text-base">
              {t('back')}
            </span>
          )}
        </motion.div>
      </Button>
    </motion.div>
  );
};
