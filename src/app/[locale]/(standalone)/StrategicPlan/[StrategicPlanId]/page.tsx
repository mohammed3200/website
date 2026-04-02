'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Target, Download, Share2 } from 'lucide-react';

import useLanguage from '@/hooks/use-language';
import { Back } from '@/components/buttons';
import { useStrategicPlanId } from '@/features/strategic-plan/hooks';
import { useGetStrategicPlan } from '@/features/strategic-plan/api';
import { DetailPageSkeleton } from '@/components/skeletons';

const PageStrategicPlan = () => {
  const StrategicPlanId = useStrategicPlanId();
  const { isArabic } = useLanguage();

  const { data, isLoading, error } = useGetStrategicPlan(StrategicPlanId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <DetailPageSkeleton />
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Plan not found</p>
        </div>
      </div>
    );
  }

  const StrategicPlan = data.data;

  // Bilingual values
  const title = isArabic
    ? StrategicPlan.titleAr || StrategicPlan.title
    : StrategicPlan.title;
  const content = isArabic
    ? StrategicPlan.contentAr || StrategicPlan.content
    : StrategicPlan.content;
  const excerpt = isArabic
    ? StrategicPlan.excerptAr || StrategicPlan.excerpt
    : StrategicPlan.excerpt;

  if (!StrategicPlan) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Content not available</p>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || 'Strategic Plan',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      console.warn('Error sharing', err);
    }
  };

  const handleDownload = () => {
    if ((StrategicPlan as any).pdfUrl) {
      window.open((StrategicPlan as any).pdfUrl, '_blank');
    } else {
      window.print();
    }
  };

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.17, 0.67, 0.83, 0.67], // easeOut cubic bezier
      },
    },
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground relative overflow-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background Decoration (Grid similar to HomeHero) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.3]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
        {/* Navigation / Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
        >
          <Back />
          
          {/* Action Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:border-primary hover:text-primary transition-all shadow-sm group"
            >
              <Share2 className="w-4 h-4" />
              <span>{isArabic ? 'مشاركة' : 'Share'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-background font-bold hover:bg-primary hover:text-white transition-all shadow-md group"
            >
              <Download className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
              <span>{isArabic ? 'تحميل التقرير' : 'Download PDF'}</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section of the Plan */}
          <div className="relative">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6"
            >
              <Target className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? 'خطة استراتيجية' : 'Strategic Initiative'}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-almarai leading-tight mb-4 text-foreground"
            >
              {title}
            </motion.h1>

            {excerpt && (
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-orange-300 rounded-full" />
                <p className="text-xl md:text-2xl text-muted-foreground font-light font-outfit">
                  {excerpt}
                </p>
              </motion.div>
            )}
          </div>

          {/* Main Content Card */}
          <motion.div
            variants={itemVariants}
            className="mt-12"
          >
            <div className="bg-card border border-gray-100 shadow-xl shadow-gray-200/40 rounded-3xl p-8 md:p-12 relative overflow-hidden group w-full">
              {/* Decorative gradient blob */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

              <div className="prose prose-lg prose-gray max-w-none font-almarai relative z-10 leading-loose">
                {content ? (
                  content
                    .split('\n\n')
                    .map((paragraph: string, idx: number) => (
                      <p
                        key={idx}
                        className="text-gray-600 leading-relaxed mb-6 last:mb-0 whitespace-pre-line text-justify"
                      >
                        {paragraph}
                      </p>
                    ))
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    {isArabic
                      ? 'المحتوى قيد الإعداد'
                      : 'Content is being prepared'}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PageStrategicPlan;
