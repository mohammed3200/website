'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/use-language';

interface AboutHeroProps {
  title: string;
  content: string;
}

export const AboutHero = ({ title, content }: AboutHeroProps) => {
  const { isArabic } = useLanguage();

  return (
    <section
      className="py-20 md:py-28 bg-gradient-to-b from-stone-50 to-white dark:from-stone-950 dark:to-stone-900"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <h1 className="font-din-bold text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="font-din-regular text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {content}
          </p>
        </motion.div>
      </div>
    </section>
  );
};