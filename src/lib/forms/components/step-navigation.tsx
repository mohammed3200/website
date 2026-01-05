'use client';

import { ArrowLeft, ArrowRight, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface StepNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  canNext?: boolean; // Can use to disable if invalid
  className?: string;
}

export function StepNavigation({
  onNext,
  onPrevious,
  isFirstStep,
  isLastStep,
  isSubmitting = false,
  canNext = true,
  className,
}: StepNavigationProps) {
  const t = useTranslations('Common');

  return (
    <div
      className={cn(
        'flex items-center justify-between w-full mt-8 pt-4 border-t',
        'max-md:fixed max-md:bottom-0 max-md:left-0 max-md:right-0 max-md:p-4 max-md:bg-background/95 max-md:backdrop-blur-sm max-md:border-t max-md:shadow-[0_-1px_2px_0_rgba(0,0,0,0.05)] max-md:z-50 max-md:mt-0',
        className,
      )}
    >
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className={cn(
          'gap-2 border-2 hover:bg-slate-50 dark:hover:bg-slate-900',
          isFirstStep && 'invisible',
        )}
        type="button"
        size="lg"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        {t('previous') || 'Previous'}
      </Button>

      <Button
        onClick={onNext}
        disabled={isSubmitting || !canNext}
        className={cn(
          'gap-2 min-w-[160px] shadow-lg font-semibold transition-all hover:scale-105 hover:shadow-xl',
          isLastStep && 'bg-green-600 hover:bg-green-700',
        )}
        type="button"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {isLastStep
              ? t('submitting') || 'Submitting...'
              : t('validating') || 'Validating...'}
          </>
        ) : isLastStep ? (
          <>
            {t('submit') || 'Submit'}
            <Check className="w-5 h-5" />
          </>
        ) : (
          <>
            {t('next') || 'Next'}
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </>
        )}
      </Button>
    </div>
  );
}
