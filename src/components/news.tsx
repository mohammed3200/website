"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Autoplay from "embla-carousel-autoplay";

import { MockNewsData } from "@/mock";

import useLanguage from "@/hooks/uselanguage";

import { truncateString } from "@/lib/utils";

import { ReadMore } from "@/components";

import { type CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CircleOff } from "lucide-react";

import { Card } from "@/components/ui/card";
import { DefaultImage } from "@/constants";

export const News = () => {
  const { isEnglish, lang } = useLanguage();
  const t = useTranslations("News");
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = MockNewsData.length;

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <section className="flex flex-col items-center">
      {MockNewsData.length > 0 ? (
        <>
          <Carousel
            opts={{
              align: "start",
            }}
            className="max-w-[75vw] lg:max-w-6xl max-md:max-w-[70vw]"
            dir="ltr"
            setApi={setApi}
            plugins={[Autoplay({ delay: 7000 })]}
          >
            <CarouselContent>
              {MockNewsData.map((item) => (
                <CarouselItem key={item.id} className="max-md:w-[80vw] h-auto" dir="rtl">
                  <div className="grid grid-cols-1 items-center md:grid-cols-5">
                    <div className="col-span-2 w-[90%]">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={300} // Default width
                          height={300} // Default height
                          sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw" // Responsive sizes for mobile and desktop
                          className="h-auto object-cover rounded-md"
                        />
                      ) : 
                        item.photoGallery.length > 0 ? (
                          <Image
                          src={item.photoGallery[0]}
                          alt={item.title}
                          width={300} // Default width
                          height={300} // Default height
                          sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw" // Responsive sizes for mobile and desktop
                          className="h-auto object-cover rounded-md"
                        />
                        ): (
                          <Image
                          src={DefaultImage.NewsDefault}
                          alt={item.title}
                          width={150} // Default width
                          height={150} // Default height
                          sizes="(max-width: 640px) 90vw, (min-width: 641px) 45vw" // Responsive sizes for mobile and desktop
                          className="h-auto w-full object-cover rounded-lg"
                        />
                        )
                      }
                    </div>
                    <div
                      className="flex flex-col justify-center col-span-1 md:col-span-3 w-[90%]"
                      dir={isEnglish ? "ltr" : "rtl"}
                    >
                      <p
                        className="font-din-bold text-black text-base md:text-lg break-words"
                        dir={isEnglish && item.title_en ? "ltr" : "rtl"}
                      >
                        {isEnglish ? item.title_en ?? item.title : item.title}
                      </p>
                      {item.description || item.description_en ? (
                        <p
                          className="font-din-regular text-light-100 text-sm md:text-base break-words"
                          dir={isEnglish ? "ltr" : "rtl"}
                        >
                          {isEnglish && item.description_en
                            ? truncateString(item.description_en,97,100)
                            : truncateString(item.description,97,100) ||
                              truncateString(item.description_en,97,100)}
                          <ReadMore href={`${lang}/News/${item.id}`} />
                        </p>
                      ) : (
                        <ReadMore href={`${lang}/News/${item.id}`} />
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div dir="ltr" className="flex flex-row gap-2 mt-2 md:mt-4">
            {Array.from({ length: count }).map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  opacity: currentIndex === index ? 1 : 0.5,
                  scale: currentIndex === index ? 1.5 : 1,
                  backgroundColor:
                    currentIndex === index ? "#fe6601" : "#a2a2a2",
                }}
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 40,
                }}
                className="w-2 h-2 rounded-full cursor-pointer"
                onClick={() => {
                  if (api) {
                    api.scrollTo(index); // Scroll to the corresponding CarouselItem
                    setCurrentIndex(index); // Update the current index
                  }
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <Card className="w-full h-full bg-transparent">
          <div
            className={`w-full flex ${
              isEnglish ? "flex-row" : "flex-row-reverse"
            } items-center justify-center
          gap-2 text-light-200`}
            dir={isEnglish ? "ltr" : "rtl"}
          >
            <p className="font-din-bold text-base md:text-lg break-words">
              {t("NoNews")}
            </p>
            <CircleOff className="size-10" />
          </div>
        </Card>
      )}
    </section>
  );
};
