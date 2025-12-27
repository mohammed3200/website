// src/features/innovators/components/CardInnovators.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Award, Lightbulb, Rocket } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { cn } from "@/lib/utils";

interface CardInnovatorsProps {
    innovator: {
        id: string;
        name: string;
        image?: string;
        projectTitle: string;
        specialization: string;
        stageDevelopment: "STAGE" | "PROTOTYPE" | "DEVELOPMENT" | "TESTING" | "RELEASED";
    };
    className?: string;
}

const stageIcons = {
    STAGE: Lightbulb,
    PROTOTYPE: Award,
    DEVELOPMENT: Rocket,
    TESTING: Award,
    RELEASED: Rocket,
};

const stageColors = {
    STAGE: "bg-blue-100 text-blue-700 border-blue-300",
    PROTOTYPE: "bg-purple-100 text-purple-700 border-purple-300",
    DEVELOPMENT: "bg-orange-100 text-orange-700 border-orange-300",
    TESTING: "bg-yellow-100 text-yellow-700 border-yellow-300",
    RELEASED: "bg-green-100 text-green-700 border-green-300",
};

const stageLabels = {
    STAGE: { ar: "فكرة", en: "Idea" },
    PROTOTYPE: { ar: "نموذج أولي", en: "Prototype" },
    DEVELOPMENT: { ar: "تحت التطوير", en: "Development" },
    TESTING: { ar: "اختبار", en: "Testing" },
    RELEASED: { ar: "جاهز", en: "Released" },
};

export const CardInnovators: React.FC<CardInnovatorsProps> = ({
    innovator,
    className,
}) => {
    const { isArabic } = useLanguage();
    const StageIcon = stageIcons[innovator.stageDevelopment];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "group relative overflow-hidden",
                "bg-white border-2 border-gray-200",
                "rounded-2xl shadow-sm hover:shadow-xl",
                "transition-all duration-300",
                className
            )}
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Stage Badge - Top Right/Left */}
            <div
                className={cn(
                    "absolute top-4 z-10",
                    isArabic ? "left-4" : "right-4"
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full",
                        "border-2 backdrop-blur-sm",
                        "font-din-bold text-xs",
                        stageColors[innovator.stageDevelopment]
                    )}
                >
                    <StageIcon size={14} />
                    <span>
                        {isArabic
                            ? stageLabels[innovator.stageDevelopment].ar
                            : stageLabels[innovator.stageDevelopment].en}
                    </span>
                </div>
            </div>

            {/* Image Container */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {innovator.image ? (
                    <Image
                        src={innovator.image}
                        alt={innovator.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                            <span className="text-white font-din-bold text-3xl">
                                {innovator.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    </div>
                )}

                {/* Gradient Overlay on Image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
                {/* Name */}
                <h3 className="font-din-bold text-lg text-gray-900 line-clamp-1">
                    {innovator.name}
                </h3>

                {/* Project Title */}
                <div className="space-y-1">
                    <p className="font-din-regular text-xs text-gray-500 uppercase tracking-wide">
                        {isArabic ? "المشروع" : "Project"}
                    </p>
                    <p className="font-din-bold text-base text-gray-800 line-clamp-2 leading-snug">
                        {innovator.projectTitle}
                    </p>
                </div>

                {/* Specialization */}
                <div className="flex items-center gap-2 pt-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Award size={16} className="text-orange-600" />
                    </div>
                    <p className="font-din-regular text-sm text-gray-600 line-clamp-1">
                        {innovator.specialization}
                    </p>
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500" />
        </motion.div>
    );
};