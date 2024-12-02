"use client";

import React, { useState } from "react";
import Image from "next/image";
import { strategics } from "@/constants";
import useLanguage from "@/hooks/uselanguage";
import { WobbleCard } from "./ui/wobble-card";
import { useMedia } from "react-use";

export const StrategicPlan = () => {
  const { isArabic } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // Default to the first card
  const isDesktop = useMedia("min-width: 640px", true);

  const handleCardClick = (index: number) => {
    if (!isDesktop) {
      // Only allow click to affect style on mobile
      setSelectedIndex(index);
    }
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl
       mx-auto w-full md:border-2 md:border-primary
        rounded-3xl p-4 overflow-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {strategics.map((strategic, index) => {
        const isSelected = selectedIndex === index;
        const isFirst = index === 0;

        const containerClassName = isDesktop
          ? isFirst
            ? "bg-primary text-white shadow-md shadow-primary"
            : "bg-neutral-200 hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary"
          : isSelected
          ? "bg-primary text-white shadow-md shadow-primary"
          : "bg-neutral-200 max-md:border-2 max-md:border-primary";

        return (
          <WobbleCard
            key={index}
            onClick={() => handleCardClick(index)}
            containerClassName={`col-span-1 h-full ${containerClassName}`}
            className="grid grid-row-1 md:grid-row-2 
            md:px-10 px-5 max-md:rounded-3xl overflow-hidden"
          >
            <div
              className="-translate-y-8 row-span-1"
            >
              <Image
                src={strategic.icon}
                width={100}
                height={100}
                className="size-24 object-fill h-auto"
                alt="Strategic Plan"
              />
            </div>
            <div className="row-span-1">
            <p className="font-din-bold md:text-base text-sm">
              {isArabic ? strategic.arabic.caption : strategic.english.caption}
            </p>
            <h2 className="font-din-regular max-w-400 md:h5 h6">
              {isArabic ? strategic.arabic.title : strategic.english.title}
            </h2>
            </div>
            
          </WobbleCard>
        );
      })}
    </div>
  );
};
