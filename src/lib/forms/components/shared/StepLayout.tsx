'use client';

import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface StepLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  errors?: Record<string, string>;
  onNext?: () => void;
  onBack?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
  backLabel?: string;
  className?: string;
}

export function StepLayout({
  children,
  title,
  description,
  errors,
  onNext,
  onBack,
  isFirstStep,
  isLastStep,
  isSubmitting,
  nextLabel,
  backLabel,
  className,
}: StepLayoutProps) {
  const t = useTranslations('Common');
  // We might want specific translations for keys if passed,
  // but for now we'll use passed labels or defaults from Common namespace.

  const hasErrors = errors && Object.keys(errors).length > 0;

  return (
    <div className={cn('space-y-8', className)}>
      {/* Optional: Step-specific title/description 
          (Note: FormContentArea usually handles the main step title, 
           but this can be used for sub-sections or standalone usage) 
      */}
      {(title || description) && (
        <div className="space-y-1">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {/* Validation Summary */}
      {hasErrors && (
        <Alert
          variant="destructive"
          className="animate-in slide-in-from-top-2 fade-in duration-300"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {/* We can hardcode "Please fix errors" or use a translation key if available */}
            Validation Error
          </AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              {Object.entries(errors).map(([field, message]) => (
                <li key={field} className="text-sm">
                  {message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="space-y-6">{children}</div>

      {/* Navigation Buttons */}
      {(onNext || onBack) && (
        <div className="flex items-center justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
          {!isFirstStep && onBack ? (
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={isSubmitting}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              {backLabel || t('back')}
            </Button>
          ) : (
            <div /> // Empty div for flex spacing
          )}

          {onNext && (
            <Button
              onClick={onNext}
              disabled={isSubmitting}
              className="gap-2 ml-auto min-w-[140px] shadow-sm transition-all hover:scale-[1.02]"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isLastStep ? t('submitting') : t('validating')}
                </>
              ) : (
                <>
                  {nextLabel || (isLastStep ? t('submit') : t('next'))}
                  {isLastStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  )}
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
