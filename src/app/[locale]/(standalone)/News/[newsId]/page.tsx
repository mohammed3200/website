"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ImageIcon, Share2 } from "lucide-react";

import useLanguage from "@/hooks/use-language";
import { useNewsId } from "@/features/news/hooks/use-news-id";
import { useGetNewsById } from "@/features/news/api/use-get-new";

import { Back } from "@/components/buttons";


const NewsIdPage = () => {
  const newsId = useNewsId();
  const { isArabic, isEnglish } = useLanguage();
  const { data: news, isLoading } = useGetNewsById(newsId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">News not found</p>
        </div>
      </div>
    );
  }

  const title = isEnglish ? (news.titleEn ?? news.title) : news.title;
  const description = isEnglish ? (news.contentEn ?? news.content) : news.content;
  const date = new Date(news.updatedAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US');
  const image = news.image?.url || '/images/placeholders/news-placeholder.jpg';

  // Parse tags
  let tags: string[] = [];
  if (news.tags) {
    tags = news.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  } else {
    // Fallback or empty
    tags = [];
  }

  return (
    <div
      className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <Back />
          <div className="flex gap-2">
            <button
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden"
        >
          {/* Hero Image */}
          <div className="relative h-[300px] md:h-[450px] w-full group overflow-hidden">
            <Image
              src={image}
              alt={title || "News Image"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

            {/* Overlay Title for Mobile/Tablet impact */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
              <div className="flex items-center gap-4 text-sm md:text-base font-medium mb-3 opacity-90 flex-wrap">
                <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <Calendar className="w-4 h-4" />
                  {date}
                </span>
              </div>
              <h1
                className="text-2xl md:text-4xl lg:text-5xl font-bold font-almarai leading-tight max-w-4xl shadow-sm"
                dir={news.titleEn && isEnglish ? "ltr" : "rtl"}
              >
                {title}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 p-6 md:p-10">

            {/* Article Content - Takes up 8 columns */}
            <div className="lg:col-span-8 space-y-6">
              <div className="prose prose-lg prose-gray max-w-none">
                <p
                  className="text-lg md:text-xl text-gray-600 leading-relaxed font-outfit whitespace-pre-line"
                  dir={news.contentEn && isEnglish ? "ltr" : "rtl"}
                >
                  {description}
                </p>
              </div>
            </div>

            {/* Sidebar / Gallery - Takes up 4 columns */}
            <div className="lg:col-span-4 space-y-8">

              {/* Gallery Widget (Hidden if no gallery) */}
              {/* Note: Database schema needs galleryIds or similar logic. For now, we hide if empty */}
              {news.galleryIds && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-lg font-almarai">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <span>Photo Gallery</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl text-center">
                    <p className="text-sm text-gray-500">Gallery implementation pending S3 integration.</p>
                  </div>
                </div>
              )}

              {/* Related Tags or Info (Placeholder for sidebar balance) */}
              <div className="p-6 border border-gray-100 rounded-2xl">
                <h3 className="font-bold text-gray-900 mb-3 font-almarai">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.length > 0 ? tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  )) : (
                    <p className="text-sm text-gray-400 italic">No tags</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsIdPage;