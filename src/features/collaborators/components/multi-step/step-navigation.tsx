"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronRight, ChevronLeft } from "lucide-react";

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onPrevious: () => void;
    canGoNext: boolean;
    canGoPrevious: boolean;
    isLoading?: boolean;
    isArabic: boolean;
}

export function StepNavigation({
    currentStep,
    totalSteps,
    onNext,
    onPrevious,
    canGoNext,
    canGoPrevious,
    isLoading,
    isArabic,
}: StepNavigationProps) {
    const t = useTranslations("CreatorsAndInnovators");
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div
            className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200"
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Previous Button */}
            <div>
                {!isFirstStep && canGoPrevious && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onPrevious}
                        disabled={isLoading}
                        className="flex items-center gap-2 min-w-[130px] h-11 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                    >
                        {isArabic ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                        <span className="font-din-regular font-medium">
                            {t("previous")}
                        </span>
                    </Button>
                )}
            </div>

            {/* Next/Submit Button */}
            <div className={isFirstStep ? "ml-auto" : ""}>
                <Button
                    type="button"
                    onClick={onNext}
                    disabled={!canGoNext || isLoading}
                    className="flex items-center gap-2 min-w-[140px] h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {!isLoading && (
                        <>
                            <span className="font-din-regular font-medium">
                                {isLastStep ? t("submit") : t("next")}
                            </span>
                            {!isLastStep &&
                                (isArabic ? (
                                    <ChevronLeft className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                ))}
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
