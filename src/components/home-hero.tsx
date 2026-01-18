"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Terminal, TrendingUp, ShieldCheck, Zap } from "lucide-react";
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
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const floatingCard: Variants = {
        animate: {
            y: [0, -15, 0],
            rotate: [0, 1, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section
            className="relative min-h-[90vh] flex items-center overflow-hidden bg-background"
            dir={isArabic ? "rtl" : "ltr"}
        >
            {/* 📐 Technical Background Grid */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* 📝 Left Content: Strategy & Leadership */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-2xl"
                    >
                        {/* Tech Badge */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="font-mono text-xs font-medium text-gray-500 tracking-wider uppercase">
                                    {t("badge")}
                                </span>
                            </div>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={itemVariants} className="font-almarai font-extrabold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight mb-6">
                            {t("titleLine1")} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                                {t("titleLine2")}
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p variants={itemVariants} className={`font-outfit text-lg text-gray-600 leading-relaxed mb-10 max-w-lg ${isArabic ? 'border-r-4 pr-6' : 'border-l-4 pl-6'} border-primary/20`}>
                            {t("subtitle")}
                        </motion.p>

                        {/* Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                            <button className="group relative px-8 py-4 bg-foreground text-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                <div className="absolute inset-0 w-full h-full bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                                <span className="relative flex items-center gap-3 font-bold">
                                    {t("startJourney")}
                                    <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                                </span>
                            </button>

                            <button className="px-8 py-4 bg-white text-foreground border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                {t("learnMore")}
                            </button>
                        </motion.div>

                        {/* Metrics / Trust */}
                        <motion.div variants={itemVariants} className="mt-12 flex items-center gap-8 text-gray-400">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-sm font-mono">SECURE_CORE</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5" />
                                <span className="text-sm font-mono">HIGH_PERFORMANCE</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* 💻 Right Visual: The "System" Interface */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative hidden lg:block h-[600px]"
                    >
                        {/* Abstract Background Blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

                        {/* 1. Main Dashboard Card */}
                        <motion.div
                            variants={floatingCard}
                            animate="animate"
                            className="absolute top-[10%] left-[10%] w-[80%] bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-6 z-20"
                        >
                            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="font-mono text-xs text-gray-400 text-end">dashboard_v1.tsx</div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-24 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                                    <TrendingUp className="w-8 h-8 text-primary/50" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-gray-100 rounded col-span-2" />
                                    <div className="h-2 bg-primary/20 rounded col-span-1" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="h-2 bg-gray-100 rounded col-span-1" />
                                    <div className="h-2 bg-gray-100 rounded col-span-2" />
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Floating Code Block (Dev) */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className={`absolute -bottom-4 ${isArabic ? '-right-4' : '-left-4'} bg-[#1e1e1e] text-white p-5 rounded-xl shadow-2xl z-30 max-w-[280px] font-mono text-xs`}
                        >
                            <div className="flex items-center gap-2 mb-3 text-gray-400">
                                <Terminal className="w-4 h-4" />
                                <span>deploy.sh</span>
                            </div>
                            <div className="space-y-1 opacity-80" dir="ltr">
                                <p><span className="text-purple-400">const</span> <span className="text-blue-400">leader</span> = <span className="text-yellow-300">new</span> Visionary();</p>
                                <p>leader.<span className="text-blue-400">init</span>(strategy);</p>
                                <p><span className="text-green-400">✓ Build Successful</span></p>
                            </div>
                        </motion.div>

                        {/* 3. Floating Stat Badge (Business) */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className={`absolute top-20 ${isArabic ? '-left-8' : '-right-8'} bg-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(255,107,0,0.15)] border border-primary/10 z-30 flex items-center gap-4`}
                        >
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                98%
                            </div>
                            <div className={isArabic ? "text-right" : ""}>
                                <div className="text-xs text-gray-400 font-bold uppercase">{isArabic ? "معدل النمو" : "Growth Rate"}</div>
                                <div className="text-sm font-bold text-foreground">{isArabic ? "تجاوز الأهداف" : "Exceeding Targets"}</div>
                            </div>
                        </motion.div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HomeHero;
