"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

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
    const t = useTranslations("CreatorsAndInnovators"); // Using common translations or specific ones
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex items-center justify-between w-full mt-8 pt-6 border-t border-gray-100">
            {/* Previous Button */}
            <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={!canGoPrevious || isLoading}
                className={`gap-2 min-w-[120px] ${currentStep === 1 ? "invisible" : ""}`}
            >
                {isArabic ? (
                    <ArrowRight className="w-4 h-4 ml-1" />
                ) : (
                    <ArrowLeft className="w-4 h-4 mr-1" />
                )}
                <span className="font-din-regular">{t("previous")}</span>
            </Button>

            {/* Next / Submit Button */}
            <Button
                type="button"
                onClick={onNext}
                disabled={!canGoNext || isLoading}
                className={`gap-2 min-w-[120px] bg-orange-500 hover:bg-orange-600 text-white ${isLoading ? "opacity-80" : ""
                    }`}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {!isLoading && (
                    <>
                        <span className="font-din-regular">
                            {isLastStep ? t("submit") : t("next")}
                        </span>
                        {!isLastStep &&
                            (isArabic ? (
                                <ArrowLeft className="w-4 h-4 mr-1" />
                            ) : (
                                <ArrowRight className="w-4 h-4 ml-1" />
                            ))}
                    </>
                )}
            </Button>
        </div>
    );
}
