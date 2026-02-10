'use client';

import { motion } from 'framer-motion';
import { Check, HelpCircle, Save, ChevronRight, ChevronLeft } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { FormStep } from '@/lib/forms/types';
import { Button } from '@/components/ui/button';

interface StepsSidebarProps {
    steps: FormStep[];
    currentStepIndex: number;
    completedSteps?: number[];
    onStepClick?: (index: number) => void;
    className?: string;
    progress: number;
    isMobile?: boolean;
}

export function StepsSidebar({
    steps,
    currentStepIndex,
    completedSteps = [],
    onStepClick,
    className,
    progress,
    isMobile = false,
}: StepsSidebarProps) {
    const locale = useLocale();
    const t = useTranslations('Navigation');
    const isRtl = locale === 'ar';

    return (
        <div
            className={cn(
                'h-full flex flex-col bg-white border-r border-gray-200',
                isMobile ? 'w-full' : 'w-80 sticky top-0 h-screen',
                className
            )}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                        <div className="w-5 h-5 bg-white rounded-full" />
                    </div>
                    <div>
                        <h1 className="font-bold text-gray-900 text-lg">Incubator</h1>
                        <p className="text-xs text-gray-500">{isRtl ? 'مركز ريادة الأعمال' : 'Entrepreneurship Center'}</p>
                    </div>
                </div>

                {/* Progress Overview */}
                <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            {isRtl ? 'التقدم' : 'Progress'}
                        </span>
                        <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                    </div>
                </div>
            </div>

            {/* Steps List */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStepIndex || completedSteps.includes(index);
                    const isActive = index === currentStepIndex;
                    const isClickable = (isCompleted || isActive) && !!onStepClick;
                    const Icon = step.icon;

                    return (
                        <motion.div
                            key={step.id}
                            initial={false}
                            animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                            className={cn(
                                'relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300',
                                isClickable ? 'cursor-pointer' : 'cursor-default',
                                isActive
                                    ? 'bg-orange-50 border-2 border-primary shadow-md'
                                    : isCompleted
                                        ? 'bg-gray-50 border-2 border-transparent hover:bg-orange-50/50'
                                        : 'bg-transparent border-2 border-transparent opacity-60'
                            )}
                            onClick={() => isClickable && onStepClick?.(index)}
                        >
                            {/* Status Indicator */}
                            <div
                                className={cn(
                                    'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0',
                                    isCompleted
                                        ? 'bg-green-100 text-green-600'
                                        : isActive
                                            ? 'bg-primary text-white shadow-lg shadow-orange-500/30'
                                            : 'bg-gray-200 text-gray-400'
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : Icon ? (
                                    <Icon className="w-5 h-5" />
                                ) : (
                                    <span className="text-sm font-bold">{index + 1}</span>
                                )}
                            </div>

                            {/* Step Info */}
                            <div className="flex-1 min-w-0">
                                <p
                                    className={cn(
                                        'text-sm font-bold truncate transition-colors',
                                        isActive ? 'text-primary' : isCompleted ? 'text-gray-700' : 'text-gray-500'
                                    )}
                                >
                                    {isRtl ? step.title.ar : step.title.en}
                                </p>
                                {step.description && (
                                    <p className="text-xs text-gray-400 truncate">
                                        {isRtl ? step.description.ar : step.description.en}
                                    </p>
                                )}
                            </div>

                            {/* Arrow for active */}
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, x: isRtl ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-primary"
                                >
                                    {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-xl h-11"
                >
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-medium">{isRtl ? 'المساعدة' : 'Help & Support'}</span>
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-gray-600 hover:text-primary hover:bg-orange-50 rounded-xl h-11"
                >
                    <Save className="w-5 h-5" />
                    <span className="font-medium">{isRtl ? 'حفظ المسودة' : 'Save Draft'}</span>
                </Button>
            </div>
        </div>
    );
}
