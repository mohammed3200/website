'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  DraftingCompass,
  Factory,
  Zap,
  CheckCircle2,
  Timer,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { ActiveButton } from '@/components/buttons';
import { useRef } from 'react';

export const HomeHero = () => {
  const router = useRouter();
  const t = useTranslations('Home');
  const { isArabic, lang } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Enhanced Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smoother feel
      },
    },
  };

  const pipelineVariants: Variants = {
    hidden: { opacity: 0, x: isArabic ? -50 : 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.3,
      },
    },
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-background"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Enhanced Background: Animated Grid with Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:60px_60px] opacity-[0.3]" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-orange-50/20" />

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content: Strategy & Speed */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            {/* Enhanced Badge with Pulse */}
            <motion.div variants={textVariants} className="mb-8">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  <Sparkles className="w-4 h-4 text-primary" />
                </motion.span>
                <span className="font-mono text-xs font-bold text-gray-600 tracking-wider uppercase">
                  {t('badge', {
                    date: isArabic
                      ? new Date().toLocaleDateString('ar-LY', {
                          year: 'numeric',
                          month: 'long',
                        })
                      : new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        }),
                  })}
                </span>
              </motion.span>
            </motion.div>

            {/* Enhanced Headline with Character Animation */}
            <motion.h1
              variants={textVariants}
              className="font-almarai font-extrabold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.1] tracking-tight mb-6"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {t('titleLine1')}
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative inline-block"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  {t('titleLine2')}
                </span>
                {/* Animated Underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-2 left-0 right-0 h-2 bg-orange-200/50 -z-10 origin-left"
                  style={{ transformOrigin: isArabic ? 'right' : 'left' }}
                />
              </motion.span>
            </motion.h1>

            {/* Enhanced Subtitle */}
            <motion.p
              variants={textVariants}
              className="font-outfit text-lg sm:text-xl text-gray-600 leading-relaxed mb-10 max-w-lg"
            >
              {t('subtitle')}
            </motion.p>

            {/* Enhanced Buttons with Better Spacing */}
            <motion.div
              variants={textVariants}
              className="flex flex-wrap gap-4"
            >
              <ActiveButton
                className="px-8 py-4 text-lg"
                containerClassName="group flex items-center gap-3"
                onClick={() => router.push(`/${lang}/entrepreneurship`)}
              >
                {t('startJourney')}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight
                    className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`}
                  />
                </motion.span>
              </ActiveButton>

              <ActiveButton
                onClick={() => router.push(`/${lang}/StrategicPlan/2`)}
                variant="secondary"
                className="px-8 py-4 text-lg"
              >
                {t('learnMore')}
              </ActiveButton>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={textVariants}
              className="mt-12 flex items-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>
                  {isArabic ? 'معتمد من الحكومة' : 'Government Certified'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>{isArabic ? '+500 شركة ناشئة' : '500+ Startups'}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual: Enhanced Smart Pipeline */}
          <motion.div
            variants={pipelineVariants}
            initial="hidden"
            animate="visible"
            className="relative hidden lg:block"
          >
            {/* Main Card with Glassmorphism */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white/50 p-8 overflow-hidden"
            >
              {/* Animated Connection Line */}
              <div
                className={`absolute ${
                  isArabic ? 'right-[3.25rem]' : 'left-[3.25rem]'
                } top-12 bottom-12 w-1 bg-gray-100 rounded-full overflow-hidden`}
              >
                <motion.div
                  className="w-full bg-gradient-to-b from-orange-400 to-orange-600 rounded-full"
                  animate={{
                    height: ['0%', '100%', '0%'],
                    top: ['0%', '0%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>

              <div className="space-y-8 relative z-10">
                {/* Step 1: Planning */}
                <motion.div
                  className={`flex items-start gap-6 group ${
                    isArabic ? 'flex-row-reverse' : ''
                  }`}
                  whileHover={{ x: isArabic ? -5 : 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 flex items-center justify-center shrink-0 shadow-sm group-hover:border-orange-200 transition-colors"
                  >
                    <DraftingCompass className="w-7 h-7 text-gray-400 group-hover:text-primary transition-colors" />
                  </motion.div>
                  <div className={`pt-2 ${isArabic ? 'text-right' : ''}`}>
                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      Strategic Planning
                    </h3>
                    <p className="text-sm text-gray-500 font-outfit">
                      Blueprint validation & resource allocation.
                    </p>
                  </div>
                </motion.div>

                {/* Step 2: Manufacturing (Active) */}
                <motion.div
                  className={`flex items-start gap-6 group ${
                    isArabic ? 'flex-row-reverse' : ''
                  }`}
                  whileHover={{ x: isArabic ? -5 : 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 0 0 rgba(254, 102, 1, 0.2)',
                        '0 0 0 10px rgba(254, 102, 1, 0)',
                        '0 0 0 0 rgba(254, 102, 1, 0)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 flex items-center justify-center shrink-0"
                  >
                    <Factory className="w-7 h-7 text-primary" />
                  </motion.div>
                  <div className={`pt-2 ${isArabic ? 'text-right' : ''}`}>
                    <div
                      className={`flex items-center gap-2 mb-1 ${
                        isArabic ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <h3 className="text-lg font-bold text-foreground">
                        Smart Manufacturing
                      </h3>
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full"
                      >
                        ACTIVE
                      </motion.span>
                    </div>
                    <p className="text-sm text-gray-500 font-outfit">
                      Automated production lines & QC.
                    </p>
                  </div>
                </motion.div>

                {/* Step 3: Delivery */}
                <motion.div
                  className={`flex items-start gap-6 group ${
                    isArabic ? 'flex-row-reverse' : ''
                  }`}
                  whileHover={{ x: isArabic ? -5 : 5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                    <Zap className="w-7 h-7 text-white fill-current" />
                  </motion.div>
                  <div className={`pt-2 ${isArabic ? 'text-right' : ''}`}>
                    <h3 className="text-lg font-bold text-foreground mb-1">
                      Rapid Delivery
                    </h3>
                    <p className="text-sm text-gray-500 font-outfit">
                      Logistics optimization & fulfillment.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, type: 'spring' }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className={`absolute top-6 ${
                  isArabic ? 'left-6' : 'right-6'
                } bg-white p-4 rounded-2xl shadow-lg border border-gray-100`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">
                      System Status
                    </p>
                    <p className="text-sm font-bold text-gray-900">Optimized</p>
                  </div>
                </div>
              </motion.div>

              {/* Timer Badge */}
              <motion.div
                animate={floatingAnimation}
                className={`absolute bottom-6 ${
                  isArabic ? 'right-6' : 'left-6'
                } flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-md border border-gray-100`}
              >
                <Timer className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-gray-700">
                  24/7 Support
                </span>
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className={`absolute -bottom-10 ${
                isArabic ? '-right-10' : '-left-10'
              } w-40 h-40 bg-primary/20 rounded-full blur-3xl -z-10`}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400"
      >
        <span className="text-xs font-medium uppercase tracking-widest">
          {isArabic ? 'اسحب للأسفل' : 'Scroll'}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeHero;
