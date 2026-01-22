"use client";

import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import useLanguage from "@/hooks/use-language";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import arMessages from "../../../messages/ar.json";
import { useRouter } from "next/navigation";

export default function NotFound() {
    return (
        <NextIntlClientProvider locale="ar" messages={arMessages} timeZone="Africa/Tripoli">
            <NotFoundContent />
        </NextIntlClientProvider>
    );
}

function NotFoundContent() {
    const { isArabic, lang } = useLanguage();
    const t = useTranslations("NotFound");
    const router = useRouter();

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background" dir={isArabic ? "rtl" : "ltr"}>
            {/* Background Beams Effect (CSS Implementation) */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,107,0,0.05)_0%,transparent_50%)] animate-pulse" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.3]" />
            </div>

            <div className="relative z-10 text-center px-4">
                {/* 404 Typography */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                >
                    <h1 className="text-[12rem] md:text-[18rem] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-gray-100 to-white drop-shadow-sm select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-[12rem] md:text-[18rem] font-extrabold leading-none text-gray-900/5 select-none blur-sm">
                            404
                        </h1>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6 -mt-10 md:-mt-20 relative z-20"
                >
                    <h2 className="text-3xl md:text-4xl font-bold font-almarai text-foreground">
                        {t("title")}
                    </h2>
                    <p className="text-gray-500 font-outfit text-lg max-w-md mx-auto">
                        {t("description")}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <button
                            onClick={() => router.push(`/${lang}`)}
                            className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-orange-600 transition-all flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            {t("goHome")}
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="px-8 py-3 bg-white text-foreground border border-gray-200 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                            {t("goBack")}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
