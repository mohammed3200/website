"use client";

import React from "react";
import Image from "next/image";
import "photoswipe/dist/photoswipe.css";
import { Gallery, Item } from "react-photoswipe-gallery";

import useLanguage from "@/hooks/uselanguage";
import { useNewsId } from "@/features/news/hooks";
import { Back } from "@/components/buttons";
import { MockNewsData } from "@/mock";

const NewsIdPage = () => {
  const newsId = useNewsId();
  const { isArabic, isEnglish } = useLanguage();
  const news = MockNewsData.find((item) => item.id.toString() === newsId);

  return (
    <div
      className="w-full flex flex-col justify-center items-center gap-6"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="w-full flex flex-row">
        <Back />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* First child - Title and Description */}
        <div
          className="w-full md:col-span-2 md:order-2 flex flex-col gap-2"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <p
            className="font-din-bold text-black max-sm:text-base md:text-lg break-words"
            dir={isEnglish && news?.title_en ? "ltr" : "rtl"}
          >
            {isEnglish ? news?.title_en ?? news?.title : news?.title}
          </p>
          {(news?.description || news?.description_en) && (
            <p
              className="font-din-regular text-light-100 max-sm:text-sm md:text-base break-words"
              dir={isEnglish ? "ltr" : "rtl"}
            >
              {isEnglish && news?.description_en
                ? news?.description_en
                : news?.description || news?.description_en}
            </p>
          )}
        </div>
        {/* Second child - Gallery */}
        {news?.photoGallery && (
          <div className="w-full md:col-span-1 md:order-1">
            <Gallery>
              <div className="grid grid-cols-2 md:grid-flow-row gap-2">
                {news.photoGallery.map((item, index) => (
                  <Item key={index} original={item}>
                    {({ ref, open }) => (
                      <div className="relative cursor-pointer">
                        <Image
                          ref={ref}
                          src={item}
                          alt={item}
                          width={200}
                          height={200}
                          onClick={open}
                          className="h-auto object-cover rounded-md"
                        />
                      </div>
                    )}
                  </Item>
                ))}
              </div>
            </Gallery>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsIdPage;