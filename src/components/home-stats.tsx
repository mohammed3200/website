'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { Users, Lightbulb, Building2, Target } from 'lucide-react';

// Fallback if NumberTicker is not available, we use framer-motion directly or just text
export const HomeStats = () => {
  const { isArabic } = useLanguage();
  const t = useTranslations('Home'); // Ensure this translation exists or use fallback

  const stats = [
    {
      id: 1,
      icon: Lightbulb,
      value: 150,
      labelAr: 'فكرة مبتكرة',
      labelEn: 'Innovative Ideas',
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      id: 2,
      icon: Target,
      value: 45,
      labelAr: 'مشروع محتضن',
      labelEn: 'Incubated Projects',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      id: 3,
      icon: Building2,
      value: 30,
      labelAr: 'شريك استراتيجي',
      labelEn: 'Strategic Partners',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      id: 4,
      icon: Users,
      value: 500,
      labelAr: 'مستفيد',
      labelEn: 'Beneficiaries',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-white dark:bg-stone-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-3xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900/50 shadow-sm hover:shadow-xl transition-all duration-500 group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bg} group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                
                <div className="space-y-1">
                  <h3 className="font-din-bold text-4xl md:text-5xl text-gray-900 dark:text-white flex items-center justify-center">
                    +<span>{stat.value}</span>
                  </h3>
                  <p className="font-din-regular text-sm md:text-base text-gray-500 dark:text-gray-400">
                    {isArabic ? stat.labelAr : stat.labelEn}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
