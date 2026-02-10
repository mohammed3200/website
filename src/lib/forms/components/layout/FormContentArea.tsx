'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { FormStep } from '@/lib/forms/types';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormContentAreaProps {
    children: React.ReactNode;
    step: FormStep;
    onMenuClick?: () => void;
    className?: string;
    progress: number;
}

export function FormContentArea({
    children,
    step,
    onMenuClick,
    className,
    progress,
}: FormContentAreaProps) {
    const locale = useLocale();
    const isRtl = locale === 'ar';

    return (
        <div className={cn('min-h-screen flex flex-col', className)}>
            {/* Mobile Header */}
            {onMenuClick && (
                <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuClick}
                            className="h-10 w-10 rounded-xl hover:bg-orange-50 hover:text-primary"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {isRtl ? `الخطوة ${Math.round(progress / (100 / 4))} من 4` : `Step ${Math.round(progress / (100 / 4))} of 4`}
                            </p>
                            <h2 className="text-sm font-bold text-gray-900 truncate">
                                {isRtl ? step.title.ar : step.title.en}
                            </h2>
                        </div>
                    </div>
                    <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12 lg:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    {/* Step Header */}
                    <div className="space-y-2">
                        <motion.div
                            initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-primary rounded-full text-xs font-bold uppercase tracking-wider"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {isRtl ? 'الخطوة الحالية' : 'Current Step'}
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-black font-almarai text-gray-900 leading-tight">
                            {isRtl ? step.title.ar : step.title.en}
                        </h1>

                        {step.description && (
                            <p className="text-lg text-gray-500 font-outfit max-w-2xl">
                                {isRtl ? step.description.ar : step.description.en}
                            </p>
                        )}
                    </div>

                    {/* Decorative Divider */}
                    <div className="flex items-center gap-4">
                        <div className="h-1 w-20 bg-gradient-to-r from-primary to-orange-300 rounded-full" />
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-6 md:p-10 relative overflow-hidden">
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-100/50 to-transparent rounded-bl-full pointer-events-none" />

                        <div className="relative z-10">
                            {children}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
