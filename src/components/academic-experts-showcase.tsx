'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useGetPublicExperts } from '@/features/academic-experts/api/use-get-public-experts';
import { AcademicExpert } from '@/features/academic-experts/types';
import { ExpertCvModal } from './expert-cv-modal';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

function calculateGap(width: number) {
  const minWidth = 1024;
  const maxWidth = 1456;
  const minGap = 60;
  const maxGap = 86;
  if (width <= minWidth) return minGap;
  if (width >= maxWidth)
    return Math.max(minGap, maxGap + 0.06018 * (width - maxWidth));
  return minGap + (maxGap - minGap) * ((width - minWidth) / (maxWidth - minWidth));
}

export const AcademicExpertsShowcase = () => {
  const t = useTranslations('AcademicExperts');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const { data: experts, isLoading } = useGetPublicExperts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedExpert, setSelectedExpert] = useState<AcademicExpert | null>(null);
  
  const [containerWidth, setContainerWidth] = useState(1200);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleResize() {
      if (imageContainerRef.current) {
        setContainerWidth(imageContainerRef.current.offsetWidth);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const expertsLength = experts?.length || 0;

  const nextSlide = useCallback(() => {
    if (expertsLength > 0) {
      setCurrentIndex((prev) => (prev + 1) % expertsLength);
    }
  }, [expertsLength]);

  const prevSlide = useCallback(() => {
    if (expertsLength > 0) {
      setCurrentIndex((prev) => (prev - 1 + expertsLength) % expertsLength);
    }
  }, [expertsLength]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (isRtl) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else if (e.key === 'ArrowRight') {
        if (isRtl) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRtl, nextSlide, prevSlide]);

  if (isLoading) {
    return (
      <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
            <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto" />
            <div className="h-10 bg-slate-200 rounded w-1/2 mx-auto" />
            <div className="h-6 bg-slate-200 rounded w-3/4 mx-auto" />
            <div className="h-[400px] bg-slate-200 rounded-3xl mt-12" />
          </div>
        </div>
      </section>
    );
  }

  if (!experts || expertsLength === 0) {
    return null;
  }

  const expert = experts[currentIndex];
  const fullName = isRtl ? expert.fullName : expert.fullNameEn || expert.fullName;
  const title = isRtl ? expert.title : expert.titleEn || expert.title;
  const specialization = isRtl ? expert.specialization : expert.specializationEn || expert.specialization;
  const bio = isRtl ? expert.bio : expert.bioEn || expert.bio;

  function getImageStyle(index: number): React.CSSProperties {
    const gap = calculateGap(containerWidth);
    const maxStickUp = gap * 0.8;
    const isActive = index === currentIndex;
    const isLeft = (currentIndex - 1 + expertsLength) % expertsLength === index;
    const isRight = (currentIndex + 1) % expertsLength === index;
    
    // Adapt visuals for RTL layout mapping
    const visualLeft = isRtl ? isRight : isLeft;
    const visualRight = isRtl ? isLeft : isRight;

    if (isActive) {
      return {
        zIndex: 3,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(0px) translateY(0px) scale(1) rotateY(0deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (visualLeft) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(-${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    if (visualRight) {
      return {
        zIndex: 2,
        opacity: 1,
        pointerEvents: "auto",
        transform: `translateX(${gap}px) translateY(-${maxStickUp}px) scale(0.85) rotateY(-15deg)`,
        transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
      };
    }
    return {
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: "all 0.8s cubic-bezier(.4,2,.3,1)",
    };
  }

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

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

        <div className="max-w-6xl mx-auto testimonial-container">
          <div className="testimonial-grid">
            
            {/* Image Section */}
            <div className="image-container" ref={imageContainerRef}>
              {experts.map((exp, index) => {
                const expName = isRtl ? exp.fullName : exp.fullNameEn || exp.fullName;
                return (
                  <div
                    key={exp.id}
                    className="testimonial-image-wrapper"
                    style={getImageStyle(index)}
                  >
                    {exp.profileImage ? (
                      <img
                        src={exp.profileImage}
                        alt={expName}
                        className="testimonial-image"
                      />
                    ) : (
                      <div className="testimonial-image flex items-center justify-center bg-slate-200 text-slate-400">
                        <span className="text-6xl font-light">
                          {expName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent rounded-[1.5rem]" />
                  </div>
                );
              })}
            </div>

            {/* Content Section */}
            <div className="testimonial-content">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex flex-col h-full justify-between"
                >
                  <div>
                    <div className="text-primary font-medium tracking-wide text-sm uppercase mb-2">
                      {specialization}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
                      {fullName}
                    </h3>
                    <div className="text-lg text-slate-600 font-medium mb-6">
                      {title}
                    </div>
                    <motion.div className="text-slate-600 leading-relaxed mb-8">
                      {bio?.split(" ").map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.22,
                            ease: "easeInOut",
                            delay: 0.01 * i, // Fast stagger for long bios
                          }}
                          className="inline-block"
                        >
                          {word}&nbsp;
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>

                  <div className="mt-auto pt-8 flex items-center justify-between">
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

                    {expertsLength > 1 && (
                      <div className="flex gap-4">
                        <button
                          onClick={prevSlide}
                          className="arrow-button bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                          aria-label="Previous expert"
                        >
                          {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                        </button>
                        <button
                          onClick={nextSlide}
                          className="arrow-button bg-primary text-primary-foreground hover:bg-primary/90"
                          aria-label="Next expert"
                        >
                          {isRtl ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Pagination Indicators */}
        {expertsLength > 1 && (
          <div 
            className="flex justify-center gap-2 mt-12"
            role="tablist"
            aria-label={t('paginationLabel')}
          >
            {experts.map((_: unknown, idx: number) => (
              <button
                key={idx}
                role="tab"
                aria-selected={idx === currentIndex}
                aria-controls={`slide-${idx}`}
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

      <ExpertCvModal
        expert={selectedExpert}
        isOpen={!!selectedExpert}
        onClose={() => setSelectedExpert(null)}
      />

      <style jsx>{`
        .testimonial-container {
          width: 100%;
          padding: 2rem 0;
        }
        .testimonial-grid {
          display: grid;
          gap: 3rem;
        }
        .image-container {
          position: relative;
          width: 100%;
          height: 24rem;
          perspective: 1000px;
        }
        .testimonial-image-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          background-color: white;
        }
        .testimonial-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 1.5rem;
        }
        .testimonial-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 24rem;
        }
        .arrow-button {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        @media (min-width: 1024px) {
          .testimonial-grid {
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
          }
        }
      `}</style>
    </section>
  );
};
