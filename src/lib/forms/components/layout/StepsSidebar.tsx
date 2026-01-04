'use client';

import { motion } from 'framer-motion';
import { Check, HelpCircle, Save } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { FormStep } from '@/lib/forms/types';
import { Button } from '@/components/ui/button';

interface StepsSidebarProps {
    steps: FormStep[];
    currentStepIndex: number;
    completedSteps?: number[]; // indices of completed steps
    onStepClick?: (index: number) => void;
    className?: string;
}

export function StepsSidebar({
    steps,
    currentStepIndex,
    completedSteps = [], // Default to empty if not provided, though logic usually infers from current index
    onStepClick,
    className,
}: StepsSidebarProps) {
    const locale = useLocale();
    const t = useTranslations('Navigation'); // Using Navigation namespace for generic terms
    const isRtl = locale === 'ar';

    return (
        <div
            className={cn(
                'w-64 flex-shrink-0 min-h-screen bg-transparent border-r border-slate-200 dark:border-slate-800 flex flex-col',
                className
            )}
        >
            {/* Header / Logo Area */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 bg-transparent">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    {/* You might want to import your Logo component here */}
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <div className="w-4 h-4 bg-primary rounded-full" />
                    </div>
                    <span>Incubator</span>
                </div>
            </div>

            {/* Steps List */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto bg-transparent">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex || completedSteps.includes(index);
                    const isActive = index === currentStepIndex;
                    const isPending = !isCompleted && !isActive;

                    // Allow clicking only if completed or active (navigation logic usually handled by parent)
                    const isClickable = (isCompleted || isActive) && !!onStepClick;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} className="relative">
                            <div
                                className={cn(
                                    'relative flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                                    isClickable ? 'cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50' : 'cursor-default',
                                    isActive && 'bg-white/10 dark:bg-slate-800/20 shadow-sm ring-1 ring-slate-200/50 dark:ring-slate-700/50'
                                )}
                                onClick={() => isClickable && onStepClick?.(index)}
                            >
                                {/* Status Indicator / Icon */}
                                <div
                                    className={cn(
                                        'relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 border',
                                        isCompleted
                                            ? 'bg-green-100/20 border-green-200/30 text-green-600 dark:bg-green-900/10 dark:border-green-800/30'
                                            : isActive
                                                ? 'bg-primary/10 border-primary/20 text-primary'
                                                : 'bg-slate-50/10 border-slate-200/20 text-slate-400 dark:bg-slate-800/10 dark:border-slate-700/20'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        Icon ? <Icon className="w-4 h-4" /> : <span className="text-xs font-mono">{index + 1}</span>
                                    )}
                                </div>

                                {/* Text Content */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={cn(
                                            'text-sm font-medium truncate',
                                            isActive ? 'text-primary' : isCompleted ? 'text-slate-700 dark:text-slate-200' : 'text-slate-500'
                                        )}
                                    >
                                        {isRtl ? step.title.ar : step.title.en}
                                    </p>
                                </div>

                                {/* Active Indicator (Right Border/Dot) */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeStep"
                                        className={cn(
                                            "absolute w-1 h-8 bg-primary rounded-full",
                                            isRtl ? "left-0" : "right-0"
                                        )}
                                    />
                                )}
                            </div>

                            {/* Connecting Line (Horizontal separator instead of vertical connector) */}
                            {index !== steps.length - 1 && (
                                <div
                                    className={cn(
                                        "mx-auto my-1 h-[2px] w-[80%] rounded-full opacity-30",
                                        isCompleted ? "bg-green-500" : "bg-slate-200 dark:bg-slate-800"
                                    )}
                                />
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/50 space-y-2 bg-transparent">
                <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                    <HelpCircle className="w-4 h-4" />
                    {isRtl ? 'المساعدة والدعم' : 'Help & Support'}
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 dark:hover:bg-slate-800/50">
                    <Save className="w-4 h-4" />
                    {isRtl ? 'حفظ وخروج' : 'Save & Exit'}
                </Button>
            </div>
        </div>
    );
}
