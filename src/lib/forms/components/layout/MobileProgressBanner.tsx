'use client';

import { Menu } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { FormStep } from '@/lib/forms/types';

interface MobileProgressBannerProps {
    steps: FormStep[];
    currentStepIndex: number;
    onMenuClick: () => void;
    className?: string;
}

export function MobileProgressBanner({
    steps,
    currentStepIndex,
    onMenuClick,
    className,
}: MobileProgressBannerProps) {
    const locale = useLocale();
    const isRtl = locale === 'ar';

    const currentStep = steps[currentStepIndex];
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className="md:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="px-4 py-3">
                <div className="flex items-center gap-3 mb-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMenuClick}
                        className="-ml-2 h-9 w-9 text-slate-500 hover:text-slate-900"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between mb-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                {isRtl
                                    ? `الخطوة ${currentStepIndex + 1} من ${steps.length}`
                                    : `Step ${currentStepIndex + 1} of ${steps.length}`
                                }
                            </span>
                            <span className="text-xs font-medium text-primary">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                            {isRtl ? currentStep.title.ar : currentStep.title.en}
                        </h2>
                    </div>
                </div>

                <Progress value={progress} className="h-1" />
            </div>
        </div>
    );
}
