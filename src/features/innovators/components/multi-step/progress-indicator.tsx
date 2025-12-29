"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ProgressProps } from "../../types/multi-step-types";

export function ProgressIndicator({
    steps,
    currentStep,
    completedSteps,
    onStepClick,
    isArabic,
}: ProgressProps) {
    const progressPercent = (currentStep / steps.length) * 100;

    return (
        <div className="w-full mb-10" dir={isArabic ? "rtl" : "ltr"}>
            {/* Progress Bar with Percentage */}
            <div className="relative mb-10">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
                <div className="flex justify-between mt-3">
                    <span className="text-sm font-din-regular text-gray-600">
                        {isArabic
                            ? `الخطوة ${currentStep} من ${steps.length}`
                            : `Step ${currentStep} of ${steps.length}`}
                    </span>
                    <motion.span
                        key={currentStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm font-din-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent"
                    >
                        {Math.round(progressPercent)}%
                    </motion.span>
                </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between relative px-2">
                {/* Connection Line Background */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full -z-10" />

                {/* Active Progress Line */}
                <motion.div
                    className="absolute top-6 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full -z-10"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />

                {steps.map((step, index) => {
                    const stepNumber = step.number;
                    const isActive = currentStep === stepNumber;
                    const isCompleted = completedSteps.includes(stepNumber);
                    const canClick = isCompleted || stepNumber === currentStep;

                    return (
                        <div
                            key={stepNumber}
                            className="flex flex-col items-center relative"
                            style={{ width: `${100 / steps.length}%` }}
                        >
                            {/* Step Circle */}
                            <motion.button
                                type="button"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: isActive ? 1.15 : 1,
                                    opacity: 1
                                }}
                                whileHover={canClick ? { scale: isActive ? 1.2 : 1.05 } : {}}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 300
                                }}
                                onClick={() => canClick && onStepClick(stepNumber)}
                                disabled={!canClick}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 relative",
                                    "backdrop-blur-sm",
                                    isActive && [
                                        "bg-gradient-to-br from-orange-500 to-orange-600",
                                        "border-orange-500",
                                        "shadow-lg shadow-orange-500/30",
                                        "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-50"
                                    ],
                                    isCompleted && !isActive && [
                                        "bg-green-500 border-green-500",
                                        "shadow-md shadow-green-500/20",
                                        "hover:shadow-lg hover:shadow-green-500/30",
                                        "cursor-pointer"
                                    ],
                                    !isActive && !isCompleted && [
                                        "bg-white border-gray-300",
                                        "cursor-not-allowed",
                                        "shadow-sm"
                                    ],
                                    canClick && "focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                                )}
                                aria-label={isArabic ? step.label.ar : step.label.en}
                                aria-current={isActive ? "step" : undefined}
                            >
                                {isCompleted ? (
                                    <motion.div
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                    >
                                        <Check className="w-6 h-6 text-white" strokeWidth={3} />
                                    </motion.div>
                                ) : (
                                    <span
                                        className={cn(
                                            "font-din-bold text-base",
                                            isActive ? "text-white" : "text-gray-500"
                                        )}
                                    >
                                        {stepNumber}
                                    </span>
                                )}
                            </motion.button>

                            {/* Step Label */}
                            <motion.span
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className={cn(
                                    "mt-3 text-xs font-din-regular text-center max-w-[90px] leading-tight",
                                    isActive && "text-orange-600 font-din-bold",
                                    isCompleted && !isActive && "text-gray-700 font-medium",
                                    !isActive && !isCompleted && "text-gray-400"
                                )}
                            >
                                {isArabic ? step.label.ar : step.label.en}
                            </motion.span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
