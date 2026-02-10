"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Target, CheckCircle2, Layers, BarChart3 } from "lucide-react";

import useLanguage from "@/hooks/use-language";
import { Back } from "@/components/buttons";
import { useStrategicPlanId } from "@/features/strategic-plan/hooks";
import { useGetStrategicPlan } from "@/features/strategic-plan/api";

const PageStrategicPlan = () => {
  const StrategicPlanId = useStrategicPlanId();
  const { isArabic } = useLanguage();

  const { data, isLoading, error } = useGetStrategicPlan(StrategicPlanId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading strategic plan...</p>
        </div>
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
  const title = isArabic ? (StrategicPlan.titleAr || StrategicPlan.title) : StrategicPlan.title;
  const content = isArabic ? (StrategicPlan.contentAr || StrategicPlan.content) : StrategicPlan.content;
  const excerpt = isArabic ? (StrategicPlan.excerptAr || StrategicPlan.excerpt) : StrategicPlan.excerpt;
  const phase = isArabic ? (StrategicPlan.phaseAr || StrategicPlan.phase) : StrategicPlan.phase;
  const progress = StrategicPlan.progress || 0;

  if (!StrategicPlan) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Content not available</p>
        </div>
      </div>
    );
  }

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.17, 0.67, 0.83, 0.67] // easeOut cubic bezier
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground relative overflow-hidden"
      dir={isArabic ? "rtl" : "ltr"}
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
          className="flex justify-between items-center mb-12"
        >
          <Back />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section of the Plan */}
          <div className="relative">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full mb-6">
              <Target className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? "خطة استراتيجية" : "Strategic Initiative"}
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-black font-almarai leading-tight mb-4 text-foreground">
              {title}
            </motion.h1>

            {excerpt && (
              <motion.div variants={itemVariants} className="flex items-center gap-4">
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
            className="grid md:grid-cols-[2fr_1fr] gap-8 mt-12"
          >
            {/* Left Column: Text Content */}
            <div className="bg-card border border-gray-100 shadow-xl shadow-gray-200/40 rounded-3xl p-8 md:p-10 relative overflow-hidden group">
              {/* Decorative gradient blob */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

              <div className="prose prose-lg prose-gray max-w-none font-almarai relative z-10">
                {content ? (
                  content.split('\n\n').map((paragraph: string, idx: number) => (
                    <p key={idx} className="text-gray-600 leading-relaxed mb-6 last:mb-0 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    {isArabic ? "المحتوى قيد الإعداد" : "Content is being prepared"}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Key Metrics / Summary */}
            <div className="space-y-6">
              {/* Status Card */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {isArabic ? "حالة المشروع" : "Project Status"}
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </div>
                  <span className="font-bold text-foreground">
                    {StrategicPlan.status === 'PUBLISHED' ? (isArabic ? "نشط وجاري العمل" : "Active & In Progress") : (isArabic ? "تحت المراجعة" : "Under Review")}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-right text-gray-400 mt-1">{progress}%</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">{isArabic ? "المرحلة" : "Phase"}</p>
                    <p className="font-bold text-foreground">{phase || (isArabic ? "قيد التنفيذ" : "Execution")}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">{isArabic ? "الأولوية" : "Priority"}</p>
                    <p className="font-bold text-foreground">{StrategicPlan.priority}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full py-4 rounded-xl bg-foreground text-background font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group">
                <span>{isArabic ? "تحميل التقرير الكامل" : "Download Full Report"}</span>
                <CheckCircle2 className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PageStrategicPlan;
