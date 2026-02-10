'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations, useLocale } from 'next-intl';

interface StepNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  canNext?: boolean;
  className?: string;
  progress?: number;
}

export function StepNavigation({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting = false,
  canNext = true,
  className,
  progress = 0,
}: StepNavigationProps) {
  const t = useTranslations('Common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div
      className={cn(
        'flex flex-col gap-4 w-full mt-8 pt-6 border-t border-gray-200',
        'max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:p-4 max-md:bg-white/95 max-md:backdrop-blur-md max-md:border-t max-md:shadow-[0_-4px_20px_rgba(0,0,0,0.05)] max-md:z-50',
        className
      )}
    >
      {/* Progress Bar for Mobile */}
      <div className="md:hidden w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep || isSubmitting}
          className={cn(
            'gap-2 h-12 px-6 rounded-xl border-2 border-gray-200',
            'transition-all duration-300',
            'hover:border-orange-300 hover:bg-orange-50/50',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isFirstStep && 'invisible'
          )}
          type="button"
        >
          {isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <span className="hidden sm:inline">{t('previous') || 'Previous'}</span>
        </Button>

        {/* Desktop Progress */}
        <div className="hidden md:flex flex-1 items-center gap-3 max-w-md mx-4">
          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
          <span className="text-sm font-bold text-gray-500 min-w-[3rem]">{Math.round(progress)}%</span>
        </div>

        <motion.div whileHover={canNext && !isSubmitting ? { scale: 1.02 } : {}} whileTap={canNext && !isSubmitting ? { scale: 0.98 } : {}}>
          <Button
            onClick={onNext}
            disabled={isSubmitting || !canNext}
            className={cn(
              'gap-2 h-12 px-8 rounded-xl font-bold shadow-lg transition-all duration-300',
              'min-w-[140px]',
              isLastStep
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-500/25'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/25',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none'
            )}
            type="button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isLastStep ? t('submitting') || 'Submitting...' : t('processing') || 'Processing...'}</span>
              </>
            ) : isLastStep ? (
              <>
                <span>{t('submit') || 'Submit'}</span>
                <Check className="w-5 h-5" />
              </>
            ) : (
              <>
                <span>{t('next') || 'Next'}</span>
                {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
