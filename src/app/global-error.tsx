"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { NextIntlClientProvider, useTranslations, type AbstractIntlMessages } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCcw, Home, Terminal, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";

import useLanguage from "@/hooks/use-language";
import { BackgroundBeams } from "@/components/ui/background-beams";

import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

const messagesMap: Record<string, AbstractIntlMessages> = {
  ar: arMessages,
  en: enMessages,
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const localeParam = params?.locale as string;
  const locale = (localeParam && messagesMap[localeParam]) ? localeParam : "ar";
  const messages = messagesMap[locale];
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Tripoli">
          <ErrorDashboard error={error} reset={reset} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

function ErrorDashboard({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  const { isArabic, lang } = useLanguage();
  const t = useTranslations("GlobalError");
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/20 overflow-hidden flex items-center justify-center p-4">
      <BackgroundBeams className="-z-10 opacity-40" />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl mx-auto"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-red-900/5 border border-white overflow-hidden text-center sm:text-start">
          
          {/* Header Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />
          
          <div className="p-8 sm:p-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8">
              <div className="flex-shrink-0">
                <div className="relative w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center border border-red-100 shadow-inner">
                  <ShieldAlert className="w-10 h-10 text-red-500" />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-red-400/20 rounded-2xl blur-md -z-10"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-almarai mb-3">
                  {t("title")}
                </h1>
                <p className="text-gray-500 leading-relaxed text-sm sm:text-base">
                  {t("description")}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start pt-4 border-t border-gray-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => reset()}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 transition-all font-semibold flex items-center justify-center gap-2 group"
              >
                <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                {isArabic ? "المحاولة مرة أخرى" : "Try Again"}
              </motion.button>

              <Link href={`/${lang}`} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-8 py-3.5 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  {t("homePage")}
                </motion.button>
              </Link>
            </div>

            {/* Developer Diagnostics Area */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-center w-full gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors py-2"
              >
                <Terminal className="w-4 h-4" />
                <span>{isArabic ? "التفاصيل التقنية" : "Technical Details"}</span>
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 p-4 bg-gray-900 rounded-xl shadow-inner text-left" dir="ltr">
                      <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-mono text-gray-300 uppercase tracking-wider">Error Digest</span>
                      </div>
                      <code className="text-sm font-mono text-gray-300 block break-all whitespace-pre-wrap">
                        {error.message || "An unexpected error occurred during execution."}
                        {error.digest && `\n\nDigest: ${error.digest}`}
                      </code>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
