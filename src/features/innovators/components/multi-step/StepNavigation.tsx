"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NavigationProps } from "../../types/multi-step-types";

export function StepNavigation({
    currentStep,
    totalSteps,
    canGoNext,
    canGoPrevious,
    onNext,
    onPrevious,
    isLoading,
    isArabic,
}: NavigationProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div
            className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200"
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
                        className="flex items-center gap-2"
                    >
                        {isArabic ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                        <span className="font-din-regular">
                            {isArabic ? "السابق" : "Previous"}
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
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 min-w-[120px]"
                >
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span className="font-din-regular">
                        {isLastStep
                            ? isArabic
                                ? "إرسال"
                                : "Submit"
                            : isArabic
                                ? "التالي"
                                : "Next"}
                    </span>
                    {!isLastStep &&
                        (isArabic ? (
                            <ChevronLeft className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        ))}
                </Button>
            </div>
        </div>
    );
}
