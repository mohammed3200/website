
'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { FormStep } from '@/lib/forms/types';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface ProgressIndicatorProps {
    steps: FormStep[];
    currentStepIndex: number;
    onStepClick?: (index: number) => void;
    className?: string;
}

export function ProgressIndicator({
    steps,
    currentStepIndex,
    onStepClick,
    className,
}: ProgressIndicatorProps) {
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const CurrentIcon = steps[currentStepIndex]?.icon;

    return (
        <div className={cn('w-full py-4', className)} dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Mobile / Compact View */}
            <div className="md:hidden space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                        {isRtl ? `الخطوة ${currentStepIndex + 1} من ${steps.length}` : `Step ${currentStepIndex + 1} of ${steps.length}`}
                    </span>
                    <div className="flex items-center gap-2">
                        {CurrentIcon && <CurrentIcon className="w-4 h-4 text-primary" />}
                        <span className="text-sm font-semibold text-primary">
                            {isRtl ? steps[currentStepIndex].title.ar : steps[currentStepIndex].title.en}
                        </span>
                    </div>
                </div>
                <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{
                            width: `${((currentStepIndex + 1) / steps.length) * 100}%`,
                        }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                </div>
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex items-center justify-between relative px-2">
                {/* Connection Line Background */}
                <div className="absolute left-0 right-0 top-5 h-1 bg-secondary/50 -z-10 rounded-full mx-6" />

                {/* Dynamic Line Progress */}
                <div
                    className="absolute top-5 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ease-in-out mx-6"
                    style={{
                        left: isRtl ? 'auto' : 0,
                        right: isRtl ? 0 : 'auto',
                        width: `${(currentStepIndex / (steps.length - 1)) * 100}%`
                    }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isClickable = index < currentStepIndex && onStepClick;
                    const title = isRtl ? step.title.ar : step.title.en;

                    const Icon = step.icon;

                    return (
                        <div
                            key={step.id}
                            className={cn(
                                'flex flex-col items-center gap-3 relative group focus:outline-none',
                                isClickable ? 'cursor-pointer' : 'cursor-default'
                            )}
                            onClick={() => isClickable && onStepClick?.(index)}
                            role={isClickable ? "button" : undefined}
                            tabIndex={isClickable ? 0 : -1}
                            onKeyDown={(e) => {
                                if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                                    onStepClick?.(index);
                                }
                            }}
                        >
                            {/* Step Circle */}
                            <motion.div
                                className={cn(
                                    'w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-colors duration-300 z-10',
                                    isCompleted
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : isCurrent
                                            ? 'border-primary bg-background text-primary ring-4 ring-primary/10'
                                            : 'border-muted-foreground/30 bg-secondary text-muted-foreground'
                                )}
                                initial={false}
                                animate={{
                                    scale: isCurrent ? 1.15 : 1,
                                    borderColor: isCurrent ? 'var(--primary)' : (isCompleted ? 'var(--primary)' : 'rgba(var(--muted-foreground), 0.3)')
                                }}
                                whileHover={isClickable ? { scale: 1.1 } : {}}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5 stroke-[3]" />
                                ) : Icon ? (
                                    <Icon className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-bold font-mono">{index + 1}</span>
                                )}
                            </motion.div>

                            {/* Step Title */}
                            <div className="flex flex-col items-center w-32 text-center absolute top-14">
                                <span
                                    className={cn(
                                        'text-xs font-semibold whitespace-nowrap transition-colors duration-300',
                                        isCurrent ? 'text-primary' : 'text-muted-foreground',
                                        isCompleted && 'text-foreground/80'
                                    )}
                                >
                                    {title}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
