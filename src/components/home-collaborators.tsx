'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { useGetCollaborators } from '@/features/collaborators/api/use-get-public-collaborators';
import { Building2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const HomeCollaborators = () => {
  const { isArabic, lang } = useLanguage();
  const t = useTranslations('collaboratingPartners');
  const router = useRouter();
  
  const { data: collaborators, isLoading } = useGetCollaborators();

  if (isLoading || !collaborators || collaborators.length === 0) {
    return null; // Don't show section if empty or loading
  }

  // Only show the first 4 for the homepage preview
  const featuredCollaborators = collaborators.slice(0, 4);

  return (
    <section className="py-20 bg-stone-50 dark:bg-stone-900/50">
      <div className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Building2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {t('title')}
              </span>
            </div>
            <h2 className="font-din-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
              {isArabic ? 'شركاء النجاح' : 'Our Success Partners'}
            </h2>
            <p className="font-din-regular text-lg text-gray-600 dark:text-gray-400">
              {t('subtitle')}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => router.push(`/${lang}/collaborators`)}
            className="hidden md:inline-flex items-center gap-2 text-primary hover:text-primary/80 font-din-bold transition-colors"
          >
            {isArabic ? 'عرض كل الشركاء' : 'View All Partners'}
            {isArabic ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCollaborators.map((collaborator, index) => (
            <motion.div
              key={collaborator.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(`/${lang}/collaborators`)}
              className="group bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full"
            >
              <div className="p-5 flex items-start gap-4 h-full">
                {/* Logo */}
                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-primary/5">
                  {collaborator.image?.url ? (
                    <img
                      src={collaborator.image.url}
                      alt={collaborator.companyName}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-primary/50" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col h-full">
                  <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-1 mb-1">
                    {collaborator.companyName}
                  </h3>
                  <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-stone-700 text-gray-600 dark:text-gray-300 w-fit mb-2">
                    {collaborator.industrialSector || 'General'}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mt-auto">
                    {collaborator.specialization || ''}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="md:hidden flex justify-center">
          <button
            onClick={() => router.push(`/${lang}/collaborators`)}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-din-bold transition-colors"
          >
            {isArabic ? 'عرض كل الشركاء' : 'View All Partners'}
            {isArabic ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </section>
  );
};
