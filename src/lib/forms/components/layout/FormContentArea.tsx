'use client';

import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { FormStep } from '@/lib/forms/types';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormContentAreaProps {
    children: React.ReactNode;
    step: FormStep;
    onMenuClick?: () => void;
    className?: string;
}

export function FormContentArea({
    children,
    step,
    onMenuClick,
    className,
}: FormContentAreaProps) {
    const locale = useLocale();
    const isRtl = locale === 'ar';

    return (
        <main className={cn('flex-1 min-h-screen relative bg-transparent', className)}>
            {/* Mobile Menu Button */}
            {onMenuClick && (
                <div className="md:hidden fixed top-4 left-4 rtl:left-auto rtl:right-4 z-50">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onMenuClick}
                        className="h-10 w-10 rounded-full shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </div>
            )}

            <div className="w-full max-w-3xl mx-auto px-4 py-8 md:py-12 lg:py-16">
                <motion.div
                    key={step.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-8"
                >
                    {/* Step Header */}
                    <div className="space-y-2 text-center md:text-start">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                            {isRtl ? step.title.ar : step.title.en}
                        </h1>
                        {step.description && (
                            <p className="text-lg text-slate-500 dark:text-slate-400">
                                {isRtl ? step.description.ar : step.description.en}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-800" />

                    {/* Step Content */}
                    <div className="relative">
                        {children}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
