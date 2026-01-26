"use client";

import Image from "next/image";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";
import { motion } from "framer-motion";
import { Calendar, ImageIcon, Share2 } from "lucide-react";

import useLanguage from "@/hooks/use-language";
import { useNewsId } from "@/features/news/hooks";
import { Back } from "@/components/buttons";
import { MockNewsData } from "@/mock";
import { cn } from "@/lib/utils";

const NewsIdPage = () => {
  const newsId = useNewsId();
  const { isArabic, isEnglish } = useLanguage();
  
  const news = MockNewsData.find((item) => item.id.toString() === newsId);

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">News not found</p>
        </div>
      </div>
    );
  }

  const title = isEnglish ? (news.title_en ?? news.title) : news.title;
  const description = isEnglish ? (news.description_en ?? news.description) : news.description;
  const date = news.updatedTime || news.creationDate;

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
              src={news.image}
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
                dir={isEnglish && news.title_en ? "ltr" : isArabic ? "rtl" : "ltr"}
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
                  dir={isEnglish ? "ltr" : "rtl"}
                >
                  {description}
                </p>
              </div>
            </div>

            {/* Sidebar / Gallery - Takes up 4 columns */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* Gallery Widget */}
              {news.photoGallery && news.photoGallery.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold text-lg font-almarai">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <span>Photo Gallery</span>
                  </div>
                  
                  <Gallery>
                    <div className="grid grid-cols-2 gap-3">
                      {news.photoGallery.map((item, index) => (
                        <Item 
                          key={index} 
                          original={item} 
                          thumbnail={item} 
                          width="1024" 
                          height="768"
                        >
                          {({ ref, open }) => (
                            <div className={cn(
                              "relative cursor-pointer overflow-hidden rounded-xl group aspect-square",
                              index === 0 ? "col-span-2 aspect-video" : "" // First image is larger
                            )}>
                              <Image
                                ref={ref as any}
                                src={item}
                                alt={`Gallery image ${index + 1}`}
                                fill
                                onClick={open}
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                          )}
                        </Item>
                      ))}
                    </div>
                  </Gallery>
                  
                  <p className="text-xs text-center text-gray-400 mt-4">
                    Click any image to view full size
                  </p>
                </div>
              )}

              {/* Related Tags or Info (Placeholder for sidebar balance) */}
              <div className="p-6 border border-gray-100 rounded-2xl">
                <h3 className="font-bold text-gray-900 mb-3 font-almarai">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Technology', 'Innovation', 'Future', 'AI'].map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
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