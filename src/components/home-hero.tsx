"use client";


import { motion, Variants } from "framer-motion";
import {
    ArrowRight,
    DraftingCompass,
    Factory,
    Zap,
    CheckCircle2,
    Timer
} from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { useTranslations } from "next-intl";

export const HomeHero = () => {
    const { isArabic } = useLanguage();
    const t = useTranslations("Home");

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    };

    const textVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" as const }
        }
    };

    const pipelineVariants: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8, ease: "easeOut" as const }
        }
    };

    return (
        <section
            className="relative min-h-[85vh] flex items-center overflow-hidden bg-background"
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* 📐 Background: Subtle Grid for "Planning" */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.4]" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* 📝 Left Content: Strategy & Speed */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-xl"
                    >
                        {/* Badge */}
                        <motion.div variants={textVariants} className="mb-6">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm">
                                <Timer className="w-3.5 h-3.5 text-primary" />
                                <span className="font-mono text-xs font-bold text-gray-600 tracking-wider uppercase">
                                    {t("badge")}
                                </span>
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={textVariants} className="font-almarai font-extrabold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight mb-6">
                            {t("titleLine1")} <br />
                            <span className="text-primary">
                                {t("titleLine2")}
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p variants={textVariants} className="font-outfit text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                            {t("subtitle")}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div variants={textVariants} className="flex flex-wrap gap-4">
                            <button className="group px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-orange-600 transition-all flex items-center gap-3">
                                {t("startJourney")}
                                <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                            </button>

                            <button className="px-8 py-4 bg-white text-foreground border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                                {t("learnMore")}
                            </button>
                        </motion.div>

                        {/* Trust Metrics */}
                        <motion.div variants={textVariants} className="mt-12 pt-8 border-t border-gray-200 flex gap-8">
                            <div>
                                <div className="text-2xl font-bold font-almarai text-foreground">500+</div>
                                <div className="text-xs text-gray-500 font-outfit uppercase tracking-wide">Factories</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold font-almarai text-foreground">24h</div>
                                <div className="text-xs text-gray-500 font-outfit uppercase tracking-wide">Avg. Response</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* 🏭 Right Visual: The Smart Pipeline */}
                    <motion.div
                        variants={pipelineVariants}
                        initial="hidden"
                        animate="visible"
                        className="relative hidden lg:block"
                    >
                        {/* The Pipeline Container */}
                        <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-8 overflow-hidden">

                            {/* Connecting Line */}
                            <div className={`absolute ${isArabic ? 'right-[3.25rem]' : 'left-[3.25rem]'} top-12 bottom-12 w-0.5 bg-gray-100`}>
                                <motion.div
                                    className="w-full bg-primary"
                                    animate={{ height: ["0%", "100%"], opacity: [0, 1, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                            </div>

                            <div className="space-y-10 relative z-10">

                                {/* Step 1: Planning (Blueprint) */}
                                <div className={`flex items-start gap-6 group ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <div className="relative w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
                                        <DraftingCompass className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className={`pt-2 ${isArabic ? 'text-right' : ''}`}>
                                        <h3 className="text-lg font-bold text-foreground mb-1">Strategic Planning</h3>
                                        <p className="text-sm text-gray-500 font-outfit">Blueprint validation & resource allocation.</p>
                                    </div>
                                </div>

                                {/* Step 2: Manufacturing (Active) */}
                                <div className={`flex items-start gap-6 group ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <div className="relative w-14 h-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                                        <div className="absolute inset-0 bg-primary/10 rounded-2xl animate-ping opacity-20" />
                                        <Factory className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className={`pt-2 ${isArabic ? 'text-right' : ''}`}>
                                        <div className={`flex items-center gap-2 mb-1 ${isArabic ? 'flex-row-reverse' : ''}`}>
                                            <h3 className="text-lg font-bold text-foreground">Smart Manufacturing</h3>
                                            <span className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full animate-pulse">ACTIVE</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-outfit">Automated production lines & QC.</p>
                                    </div>
                                </div>

                                {/* Step 3: Delivery (Speed) */}
                                <div className={`flex items-start gap-6 group ${isArabic ? 'flex-row-reverse' : ''}`}>
                                    <div className="relative w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center shrink-0 overflow-hidden">
                                        {/* Speed Lines Animation */}
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                            animate={{ x: ["-100%", "200%"] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <Zap className="w-6 h-6 text-white fill-current" />
                                    </div>
                                    <div className={`pt-2 ${isArabic ? 'text-right' : ''}`}>
                                        <h3 className="text-lg font-bold text-foreground mb-1">Rapid Delivery</h3>
                                        <p className="text-sm text-gray-500 font-outfit">Logistics optimization & fulfillment.</p>
                                    </div>
                                </div>

                            </div>

                            {/* Floating "Completed" Badge */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1, type: "spring" }}
                                className={`absolute top-6 ${isArabic ? 'left-6' : 'right-6'} flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-100 ${isArabic ? 'flex-row-reverse' : ''}`}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-xs font-bold">System Optimized</span>
                            </motion.div>

                        </div>

                        {/* Decorative Elements */}
                        <motion.div
                            className={`absolute -bottom-6 ${isArabic ? '-left-6' : '-right-6'} w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10`}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HomeHero;
