'use client';

import React, { useCallback } from 'react';
import { motion, Variants } from 'framer-motion';
import { Target, CheckCircle2, Layers, Share2, Download } from 'lucide-react';

import useLanguage from '@/hooks/use-language';
import { Back } from '@/components/buttons';
import { useStrategicPlanId } from '@/features/strategic-plan/hooks';
import { useGetStrategicPlan } from '@/features/strategic-plan/api';
import { DetailPageSkeleton } from '@/components/skeletons';
import { cn } from '@/lib/utils';

// ─── Animation Tokens ─────────────────────────────────────────────────────────

const EASE = [0.17, 0.67, 0.83, 0.67] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, isArabic }: { status: string; isArabic: boolean }) {
  const isPublished = status === 'PUBLISHED';
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={cn(
          'relative flex h-2.5 w-2.5',
          isPublished && '[&>span:first-child]:animate-ping',
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            'absolute inline-flex h-full w-full rounded-full opacity-75',
            isPublished ? 'bg-emerald-400' : 'bg-amber-400',
          )}
        />
        <span
          className={cn(
            'relative inline-flex rounded-full h-2.5 w-2.5',
            isPublished ? 'bg-emerald-500' : 'bg-amber-500',
          )}
        />
      </span>
      <span className="font-semibold text-foreground text-sm">
        {isPublished
          ? isArabic ? 'نشط وجاري العمل' : 'Active & In Progress'
          : isArabic ? 'تحت المراجعة' : 'Under Review'}
      </span>
    </div>
  );
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

interface ActionButtonsProps {
  title: string;
  isArabic: boolean;
}

function ActionButtons({ title, isArabic }: ActionButtonsProps) {
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled or not supported — silent fallback
        await navigator.clipboard.writeText(url);
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  }, [title]);

  const handleDownload = useCallback(() => {
    window.print();
  }, []);

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        isArabic ? 'flex-row-reverse' : 'flex-row',
      )}
      role="group"
      aria-label={isArabic ? 'إجراءات المستند' : 'Document actions'}
    >
      {/* Share — secondary */}
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        title={isArabic ? 'مشاركة الرابط' : 'Share link'}
        aria-label={isArabic ? 'مشاركة الرابط' : 'Share link'}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold',
          'bg-white border-2 border-gray-200 text-gray-700',
          'hover:border-orange-300 hover:text-primary transition-colors duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
        )}
      >
        <Share2 className="w-4 h-4" aria-hidden="true" />
        <span>{isArabic ? 'مشاركة' : 'Share'}</span>
      </motion.button>

      {/* Download — primary */}
      <motion.button
        onClick={handleDownload}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        title={isArabic ? 'تحميل كـ PDF' : 'Download as PDF'}
        aria-label={isArabic ? 'تحميل كـ PDF' : 'Download as PDF'}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold',
          'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
          'shadow-md shadow-orange-500/25',
          'hover:shadow-lg hover:shadow-orange-500/40 transition-shadow duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
        )}
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>{isArabic ? 'تحميل PDF' : 'Download PDF'}</span>
      </motion.button>
    </div>
  );
}

// ─── Phase Card ───────────────────────────────────────────────────────────────

function PhaseCard({ phase, isArabic }: { phase: string | null | undefined; isArabic: boolean }) {
  const label = phase || (isArabic ? 'قيد التنفيذ' : 'Execution');
  return (
    <div className="bg-gray-50 rounded-2xl p-5 flex items-center gap-4 border border-transparent hover:bg-white hover:border-gray-100 hover:shadow-md transition-all duration-200">
      <div className="p-3 bg-blue-100 text-blue-600 rounded-xl flex-shrink-0">
        <Layers className="w-5 h-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">
          {isArabic ? 'المرحلة' : 'Phase'}
        </p>
        <p className="font-bold text-foreground text-sm">{label}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PageStrategicPlan = () => {
  const StrategicPlanId = useStrategicPlanId();
  const { isArabic } = useLanguage();
  const { data, isLoading, error } = useGetStrategicPlan(StrategicPlanId);

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <DetailPageSkeleton />
      </div>
    );
  }

  // ── Error / Not Found ──
  if (error || !data?.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto" aria-hidden="true" />
          <p className="text-gray-500 text-lg font-medium">
            {isArabic ? 'الخطة غير موجودة' : 'Plan not found'}
          </p>
        </div>
      </div>
    );
  }

  const plan = data.data;

  // Bilingual content resolution
  const title = isArabic ? (plan.titleAr || plan.title) : plan.title;
  const content = isArabic ? (plan.contentAr || plan.content) : plan.content;
  const excerpt = isArabic ? (plan.excerptAr || plan.excerpt) : plan.excerpt;
  const phase = isArabic ? (plan.phaseAr || plan.phase) : plan.phase;

  // Unreachable guard (data.data is already checked above)
  if (!plan) return null;

  return (
    <div
      className="min-h-screen bg-background text-foreground relative overflow-hidden"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Background grid decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.3]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">

        {/* ── Top Navigation Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center justify-between mb-12 gap-4 flex-wrap"
        >
          <Back />
          <ActionButtons title={title} isArabic={isArabic} />
        </motion.div>

        {/* ── Main Content ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="space-y-4">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full"
            >
              <Target className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isArabic ? 'خطة استراتيجية' : 'Strategic Initiative'}
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-black font-almarai leading-tight text-foreground"
            >
              {title}
            </motion.h1>

            {excerpt && (
              <motion.div variants={itemVariants} className="flex items-center gap-4">
                <div
                  className="h-1.5 w-24 bg-gradient-to-r from-primary to-orange-300 rounded-full flex-shrink-0"
                  aria-hidden="true"
                />
                <p className="text-xl md:text-2xl text-muted-foreground font-light font-outfit">
                  {excerpt}
                </p>
              </motion.div>
            )}
          </div>

          {/* Body: 2-column grid */}
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-[2fr_1fr] gap-8 mt-6"
          >
            {/* Left — Long-form content */}
            <div
              className="bg-card border border-gray-100 shadow-xl shadow-gray-200/40 rounded-3xl p-8 md:p-10 relative overflow-hidden group"
              role="main"
            >
              <div
                className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"
                aria-hidden="true"
              />
              <div className="prose prose-lg prose-gray max-w-none font-almarai relative z-10">
                {content ? (
                  content.split('\n\n').map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-gray-600 leading-relaxed mb-6 last:mb-0 whitespace-pre-line"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    {isArabic ? 'المحتوى قيد الإعداد' : 'Content is being prepared'}
                  </p>
                )}
              </div>
            </div>

            {/* Right — Sidebar */}
            <aside className="space-y-5">
              {/* Status Card */}
              <div
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                aria-label={isArabic ? 'حالة المشروع' : 'Project status'}
              >
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  {isArabic ? 'حالة المشروع' : 'Project Status'}
                </h2>
                <StatusBadge status={plan.status} isArabic={isArabic} />
              </div>

              {/* Phase Card */}
              <PhaseCard phase={phase} isArabic={isArabic} />

              {/* Share / Download — repeated in sidebar for desktop convenience */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  {isArabic ? 'إجراءات سريعة' : 'Quick Actions'}
                </h2>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => window.print()}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold',
                      'bg-foreground text-background',
                      'hover:bg-primary hover:text-white transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
                    )}
                    aria-label={isArabic ? 'تحميل كـ PDF' : 'Download as PDF'}
                  >
                    <Download className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span>{isArabic ? 'تحميل PDF' : 'Download PDF'}</span>
                  </button>
                  <button
                    onClick={async () => {
                      const url = window.location.href;
                      if (navigator.share) {
                        try { await navigator.share({ title, url }); } catch { /* cancelled */ }
                      } else {
                        await navigator.clipboard.writeText(url);
                      }
                    }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold',
                      'bg-white border border-gray-200 text-gray-700',
                      'hover:border-orange-300 hover:text-primary transition-colors duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
                    )}
                    aria-label={isArabic ? 'مشاركة الرابط' : 'Share link'}
                  >
                    <Share2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span>{isArabic ? 'مشاركة الرابط' : 'Share Link'}</span>
                  </button>
                </div>
              </div>
            </aside>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PageStrategicPlan;
