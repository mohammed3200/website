'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { FormStep } from '@/lib/forms/types';
import { StepsSidebar } from './StepsSidebar';
import { FormContentArea } from './FormContentArea';
import { useLocale, useTranslations } from 'next-intl';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface RegistrationLayoutProps {
    children: React.ReactNode;
    steps: FormStep[];
    currentStepIndex: number;
    onStepClick: (index: number) => void;
    className?: string;
}

export function RegistrationLayout({
    children,
    steps,
    currentStepIndex,
    onStepClick,
    className,
}: RegistrationLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const t = useTranslations('Common');

    const currentStep = steps[currentStepIndex];

    // Handler to close mobile menu when a step is clicked
    const handleStepClick = (index: number) => {
        onStepClick(index);
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-transparent">

            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:block">
                <StepsSidebar
                    steps={steps}
                    currentStepIndex={currentStepIndex}
                    onStepClick={onStepClick}
                />
            </div>

            {/* Mobile Drawer */}
            <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetContent side={isRtl ? 'right' : 'left'} className="p-0 w-[300px]">
                        <VisuallyHidden>
                            <SheetTitle>{t('formNavigation')}</SheetTitle>
                        </VisuallyHidden>
                        <StepsSidebar
                            steps={steps}
                            currentStepIndex={currentStepIndex}
                            onStepClick={handleStepClick}
                            className="w-full border-none"
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content Area */}
            <FormContentArea step={currentStep} onMenuClick={() => setIsMobileMenuOpen(true)}>
                {children}
            </FormContentArea>

        </div>
    );
}
