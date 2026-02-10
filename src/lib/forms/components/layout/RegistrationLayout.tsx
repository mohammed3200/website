'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { FormStep } from '@/lib/forms/types';
import { StepsSidebar } from './StepsSidebar';
import { FormContentArea } from './FormContentArea';
import { useLocale, useTranslations } from 'next-intl';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface RegistrationLayoutProps {
    children: React.ReactNode;
    steps: FormStep[];
    currentStepIndex: number;
    onStepClick: (index: number) => void;
    className?: string;
    formData?: Record<string, any>;
    onSaveDraft?: () => void;
}

export function RegistrationLayout({
    children,
    steps,
    currentStepIndex,
    onStepClick,
    className,
    formData,
    onSaveDraft,
}: RegistrationLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const t = useTranslations('Common');
    const currentStep = steps[currentStepIndex];

    const handleStepClick = (index: number) => {
        onStepClick(index);
        setIsMobileMenuOpen(false);
    };

    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    return (
        <div className={cn('min-h-screen bg-gray-50/50 relative', className)}>
            {/* Background Grid Pattern - Matching Strategic Plan page */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.3]" />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50/50" />
            </div>

            <div className="flex flex-col md:flex-row min-h-screen relative z-10">
                {/* Desktop Sidebar */}
                <div className="hidden md:block w-80 flex-shrink-0">
                    <StepsSidebar
                        steps={steps}
                        currentStepIndex={currentStepIndex}
                        onStepClick={handleStepClick}
                        progress={progress}
                    />
                </div>

                {/* Mobile Drawer */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetContent side={isRtl ? 'right' : 'left'} className="p-0 w-[320px] border-none">
                        <VisuallyHidden>
                            <SheetTitle>{t('navigation') || 'Navigation'}</SheetTitle>
                        </VisuallyHidden>
                        <StepsSidebar
                            steps={steps}
                            currentStepIndex={currentStepIndex}
                            onStepClick={handleStepClick}
                            progress={progress}
                            isMobile
                        />
                    </SheetContent>
                </Sheet>

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    <FormContentArea
                        step={currentStep}
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                        progress={progress}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </FormContentArea>
                </main>
            </div>
        </div>
    );
}
