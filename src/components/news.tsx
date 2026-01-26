"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Newspaper } from 'lucide-react';
import { useTranslations } from "next-intl";
import useLanguage from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import { MockNewsData as MOCK_NEWS } from "@/mock"
import Image from 'next/image';
import { ReadMore } from '@/components/buttons/read-more';


const truncateString = (str: string, num: number) => str.length > num ? str.slice(0, num) + "..." : str;


export const News = () => {
  const { isArabic, lang } = useLanguage();
  const t = useTranslations("News");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % MOCK_NEWS.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + MOCK_NEWS.length) % MOCK_NEWS.length);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentNews = MOCK_NEWS[currentIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : 50,
      opacity: 0,
    })
  };

  return (
    <section className="w-full py-16 bg-background overflow-hidden" dir={isArabic ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Newspaper className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold font-almarai text-foreground">{t("latestNews")}</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>
            <button
              onClick={nextSlide}
              className="p-3 rounded-full border border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group"
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* Main Slider Card */}
        <div className="relative w-full max-w-6xl mx-auto h-[500px] md:h-[400px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="w-full h-full bg-white rounded-3xl shadow-xl shadow-gray-100 overflow-hidden border border-gray-100 flex flex-col md:flex-row">

                {/* Image Section */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden group">
                  <Image
                    fill
                    src={currentNews.image}
                    alt={currentNews.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />

                  {/* updatedTime Badge (Mobile) */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary md:hidden">
                    {currentNews.updatedTime}
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center relative">
                  {/* updatedTime Badge (Desktop) */}
                  <div className="hidden md:inline-flex self-start mb-4 px-3 py-1 bg-primary/5 text-primary text-sm font-bold rounded-full border border-primary/10">
                    {currentNews.updatedTime}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold font-almarai text-foreground mb-4 leading-tight">
                    {currentNews.title}
                  </h3>

                  <p className="text-gray-500 font-outfit text-base md:text-lg leading-relaxed mb-8">
                    {truncateString(currentNews.description, 150)}
                  </p>

                  <div className="self-start">
                    <ReadMore href={`/${lang}/News/${currentNews.id}`} />
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {MOCK_NEWS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                currentIndex === idx ? "w-8 bg-primary" : "w-2 bg-gray-300 hover:bg-primary/50"
              )}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
