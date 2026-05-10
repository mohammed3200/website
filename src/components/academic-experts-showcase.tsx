'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';
import { useGetPublicExperts } from '@/features/academic-experts/api/use-get-public-experts';
import { AcademicExpert } from '@/features/academic-experts/types';
import { ExpertCvModal } from './expert-cv-modal';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const AcademicExpertsShowcase = () => {
  const t = useTranslations('AcademicExperts');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { data: experts, isLoading } = useGetPublicExperts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<AcademicExpert | null>(null);

  if (isLoading || !experts || experts.length === 0) {
    return null; // Do not render if no experts available or loading
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % experts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + experts.length) % experts.length);
  };

  const expert = experts[currentIndex];
  
  const fullName = isRtl ? expert.fullName : expert.fullNameEn || expert.fullName;
  const title = isRtl ? expert.title : expert.titleEn || expert.title;
  const specialization = isRtl ? expert.specialization : expert.specializationEn || expert.specialization;
  const bio = isRtl ? expert.bio : expert.bioEn || expert.bio;

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {t('badge')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Image Section */}
              <div className="relative h-[400px] lg:h-auto bg-slate-100 overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {expert.profileImage ? (
                      <img
                        src={expert.profileImage}
                        alt={fullName}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400">
                        <span className="text-6xl font-light">
                          {fullName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content Section */}
              <div className="relative p-8 lg:p-12 xl:p-16 flex flex-col justify-center min-h-[400px] lg:min-h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col h-full"
                  >
                    <div className="mb-8">
                      <div className="text-primary font-medium tracking-wide text-sm uppercase mb-2">
                        {specialization}
                      </div>
                      <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                        {fullName}
                      </h3>
                      <div className="text-lg text-slate-600 font-medium">
                        {title}
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-8 line-clamp-4">
                      {bio}
                    </p>

                    <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                      <Button
                        onClick={() => setSelectedExpert(expert)}
                        variant="default"
                        size="lg"
                        className="group"
                      >
                        {t('viewCV')}
                        {isRtl ? (
                          <ArrowLeft className="ml-2 w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        ) : (
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        )}
                      </Button>

                      {experts.length > 1 && (
                        <div className="flex gap-2" dir="ltr">
                          <Button
                            onClick={isRtl ? nextSlide : prevSlide}
                            variant="outline"
                            size="icon"
                            className="rounded-full w-10 h-10 border-slate-200 hover:bg-slate-50 hover:text-primary"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={isRtl ? prevSlide : nextSlide}
                            variant="outline"
                            size="icon"
                            className="rounded-full w-10 h-10 border-slate-200 hover:bg-slate-50 hover:text-primary"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Pagination Indicators */}
            {experts.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
                {experts.map((_: unknown, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      idx === currentIndex 
                        ? "bg-primary w-6" 
                        : "bg-slate-300 hover:bg-primary/50"
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ExpertCvModal
        expert={selectedExpert}
        isOpen={!!selectedExpert}
        onClose={() => setSelectedExpert(null)}
      />
    </section>
  );
};
