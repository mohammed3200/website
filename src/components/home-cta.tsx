'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { ArrowRight, Lightbulb, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export const HomeCTA = () => {
  const { isArabic, lang } = useLanguage();
  const router = useRouter();

  return (
    <section className="py-24 relative overflow-hidden bg-primary dark:bg-primary/90">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              {isArabic 
                ? 'هل أنت مستعد لتكون جزءاً من المستقبل؟'
                : 'Are you ready to be part of the future?'}
            </h2>
            <p className="font-din-regular text-xl text-white/80 max-w-2xl mx-auto">
              {isArabic
                ? 'انضم إلينا اليوم كمبتكر أو شريك متعاون وساهم في بناء اقتصاد المعرفة في ليبيا.'
                : 'Join us today as an innovator or collaborating partner and contribute to building Libya\'s knowledge economy.'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button
              onClick={() => router.push(`/${lang}/innovators/registration/personal-info`)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-primary font-din-bold text-lg rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <div className="absolute inset-0 bg-stone-50 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Lightbulb className="w-5 h-5 relative z-10" />
              <span className="relative z-10">
                {isArabic ? 'سجل كمبتكر' : 'Register as Innovator'}
              </span>
              <ArrowRight className={cn("w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1", isArabic && "rotate-180 group-hover:-translate-x-1")} />
            </button>

            <button
              onClick={() => router.push(`/${lang}/collaborators/registration/company-info`)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white font-din-bold text-lg rounded-full overflow-hidden hover:bg-white/10 transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <Building2 className="w-5 h-5 relative z-10" />
              <span className="relative z-10">
                {isArabic ? 'انضم كشريك' : 'Join as Partner'}
              </span>
              <ArrowRight className={cn("w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1", isArabic && "rotate-180 group-hover:-translate-x-1")} />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
