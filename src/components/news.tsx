"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { MockNewsData } from "@/mock";
import { type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const News = () => {
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
    <div className="flex flex-col items-center mx-auto w-full">
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full md:max-w-6xl"
        dir="ltr"
        setApi={setApi}
        plugins={[Autoplay({ delay: 7000 })]}
      >
        <CarouselContent>
          {MockNewsData.map((item) => (
            <CarouselItem key={item.title} className="h-auto" dir="rtl">
              <div className="flex flex-col gap-4 justify-center items-center md:flex-row">
                <div>
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="h-auto object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-din-bold text-black text-base md:text-lg break-words">{item.title}</p>
                  <p className="font-din-regular text-light-100 text-sm md:text-base break-words">{item.description}</p>
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
              backgroundColor: currentIndex === index ? "#fe6601" : "#a2a2a2",
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
    </div>
  );
};