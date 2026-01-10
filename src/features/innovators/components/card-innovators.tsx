// src/features/innovators/components/card-innovators.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbulb, Rocket, MapPin, Mail, Phone, Code, FlaskConical, Zap, ChevronRight, User } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalTrigger, ModalBody, ModalContent } from "@/components/ui/animated-modal";

// 🧱 Data Contract
export interface Innovator {
    id: string;
    name: string;
    image?: string | { data: string; type: string };
    imageId?: string;
    email?: string;
    phone?: string;
    country?: string;
    city?: string;
    specialization: string;
    projectTitle: string;
    projectDescription?: string;
    objective?: string;
    stageDevelopment: "IDEA" | "PROTOTYPE" | "DEVELOPMENT" | "TESTING" | "MARKET_READY";
}

interface CardInnovatorsProps {
    innovator: Innovator;
    className?: string;
}

const getStageConfig = (stage: Innovator["stageDevelopment"]) => {
    switch (stage) {
        case "IDEA":
            return { icon: Lightbulb, color: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200" };
        case "PROTOTYPE":
            return { icon: FlaskConical, color: "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200" };
        case "DEVELOPMENT":
            return { icon: Code, color: "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200" };
        case "TESTING":
            return { icon: Zap, color: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200" };
        case "MARKET_READY":
            return { icon: Rocket, color: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200" };
        default:
            return { icon: Lightbulb, color: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200" };
    }
};

const stageLabels = {
    IDEA: { ar: "فكرة", en: "Idea" },
    PROTOTYPE: { ar: "نموذج أولي", en: "Prototype" },
    DEVELOPMENT: { ar: "تحت التطوير", en: "Development" },
    TESTING: { ar: "اختبار", en: "Testing" },
    MARKET_READY: { ar: "جاهز", en: "Market Ready" },
};

const InnovatorDetailsModal = ({ innovator }: { innovator: Innovator }) => {
    const { isArabic } = useLanguage();
    const stageConfig = getStageConfig(innovator.stageDevelopment);
    const StageIcon = stageConfig.icon;

    let imageSrc = "";
    if (innovator.image) {
        if (typeof innovator.image === "string") {
            imageSrc = innovator.image;
        } else if (innovator.image.data) {
            imageSrc = `data:${innovator.image.type};base64,${innovator.image.data}`;
        }
    }

    return (
        <ModalBody>
            <ModalContent>
                <div className="space-y-6" dir={isArabic ? "rtl" : "ltr"}>
                    {/* Header */}
                    <div className="flex items-center gap-4 pb-4 border-b">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-background shadow-sm ring-1 ring-border/50">
                            {imageSrc ? (
                                <Image
                                    src={imageSrc}
                                    alt={innovator.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                    <User className="w-10 h-10 text-primary/70" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-din-bold text-foreground">{innovator.name}</h2>
                            <p className="text-sm text-primary font-din-medium mt-1">{innovator.specialization}</p>
                        </div>
                    </div>

                    {/* Project */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-din-bold text-muted-foreground uppercase tracking-wide">
                                {isArabic ? "المشروع" : "Project"}
                            </h3>
                            <Badge variant="outline" className={cn("gap-1.5", stageConfig.color)}>
                                <StageIcon size={12} />
                                <span className="font-din-bold text-xs">
                                    {isArabic ? stageLabels[innovator.stageDevelopment].ar : stageLabels[innovator.stageDevelopment].en}
                                </span>
                            </Badge>
                        </div>
                        <h4 className="text-xl font-din-bold text-foreground mb-2">{innovator.projectTitle}</h4>
                        {innovator.projectDescription && (
                            <p className="text-sm font-din-regular text-muted-foreground leading-relaxed">
                                {innovator.projectDescription}
                            </p>
                        )}
                    </div>

                    {/* Objective */}
                    {innovator.objective && (
                        <div>
                            <h3 className="text-sm font-din-bold text-muted-foreground uppercase tracking-wide mb-2">
                                {isArabic ? "الهدف" : "Objective"}
                            </h3>
                            <p className="text-sm font-din-regular text-foreground leading-relaxed">
                                {innovator.objective}
                            </p>
                        </div>
                    )}

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-din-bold text-muted-foreground uppercase tracking-wide mb-3">
                            {isArabic ? "معلومات الاتصال" : "Contact Information"}
                        </h3>
                        <div className="space-y-3">
                            {(innovator.city || innovator.country) && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <span className="text-sm font-din-regular">
                                        {[innovator.city, innovator.country].filter(Boolean).join(", ")}
                                    </span>
                                </div>
                            )}
                            {innovator.email && (
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <a href={`mailto:${innovator.email}`} className="text-sm font-din-regular hover:text-primary transition-colors">
                                        {innovator.email}
                                    </a>
                                </div>
                            )}
                            {innovator.phone && (
                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <a href={`tel:${innovator.phone}`} className="text-sm font-din-regular hover:text-primary transition-colors">
                                        {innovator.phone}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ModalContent>
        </ModalBody>
    );
};

export const CardInnovators: React.FC<CardInnovatorsProps> = ({
    innovator,
    className,
}) => {
    const { isArabic } = useLanguage();
    const stageConfig = getStageConfig(innovator.stageDevelopment);
    const StageIcon = stageConfig.icon;

    let imageSrc = "";
    if (innovator.image) {
        if (typeof innovator.image === "string") {
            imageSrc = innovator.image;
        } else if (innovator.image.data) {
            imageSrc = `data:${innovator.image.type};base64,${innovator.image.data}`;
        }
    }

    return (
        <Modal>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
                className={cn(
                    "group relative overflow-hidden bg-card border border-border/50 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-300",
                    className
                )}
                dir={isArabic ? "rtl" : "ltr"}
            >
                {/* Thin gradient accent bar */}
                <div className="h-1 bg-gradient-to-r from-primary to-primary/70" />

                <div className="p-4 flex items-center gap-4">
                    {/* Avatar (smaller) */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-background shadow-sm ring-1 ring-border/50 shrink-0">
                        {imageSrc ? (
                            <Image
                                src={imageSrc}
                                alt={innovator.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-din-bold text-xl">
                                    {innovator.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-din-bold text-base text-foreground leading-tight mb-0.5 truncate">
                            {innovator.name}
                        </h3>
                        <p className="text-xs text-primary font-din-medium mb-1 truncate">
                            {innovator.specialization}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground font-din-regular truncate">
                                {innovator.projectTitle}
                            </p>
                            <Badge variant="outline" className={cn("gap-1 px-1.5 py-0.5 shrink-0", stageConfig.color)}>
                                <StageIcon size={10} />
                                <span className="text-[10px] font-din-bold">
                                    {isArabic ? stageLabels[innovator.stageDevelopment].ar : stageLabels[innovator.stageDevelopment].en}
                                </span>
                            </Badge>
                        </div>
                    </div>

                    {/* View Details Button */}
                    <ModalTrigger className="shrink-0 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white text-xs font-din-medium rounded-lg transition-colors flex items-center gap-1.5">
                        <span>{isArabic ? "التفاصيل" : "Details"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </ModalTrigger>
                </div>
            </motion.div>

            <InnovatorDetailsModal innovator={innovator} />
        </Modal>
    );
};