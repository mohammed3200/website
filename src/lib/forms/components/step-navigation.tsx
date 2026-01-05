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
        variant="ghost"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className={cn(
          'gap-2 text-muted-foreground hover:text-foreground',
          isFirstStep && 'invisible',
        )}
        type="button"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('previous') || 'Previous'}
      </Button>

      <Button
        onClick={onNext}
        disabled={isSubmitting || !canNext}
        className={cn(
          'gap-2 min-w-[140px] shadow-sm transition-all hover:scale-[1.02]',
          className,
        )}
        type="button"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isLastStep
              ? t('submitting') || 'Submitting...'
              : t('validating') || 'Validating...'}
          </>
        ) : isLastStep ? (
          <>
            {t('submit') || 'Submit'}
            <Check className="w-4 h-4" />
          </>
        ) : (
          <>
            {t('next') || 'Next'}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}
