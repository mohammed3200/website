"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, CircleArrowRight } from "lucide-react";

import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/use-language";

import { ActiveButton, AnimatedList } from "@/components";

import { InterfaceImage } from "@/constants";
import { MockInnovatorsData } from "@/mock";
import { CardInnovators } from "@/features/innovators/components/card-innovators";


export const Introduction = () => {
  const router = useRouter();
  const { isArabic, lang } = useLanguage();
  const t = useTranslations("CreatorsAndInnovators");

  return (
    <div
      className="w-full min-h-[80vh] grid grid-cols-1 lg:grid-cols-12 items-center gap-8 md:gap-12 lg:gap-16 px-6 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 overflow-hidden"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Left Content Section */}
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="lg:col-span-5 flex flex-col items-center lg:items-start gap-6 md:gap-8"
      >
        {/* Image */}
        <div className="relative w-full max-w-sm lg:max-w-md">
          <Image
            src={InterfaceImage.InnovationRafiki}
            alt="Innovation illustration"
            width={300}
            height={300}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 250px"
            className="object-contain h-auto w-full transition-transform duration-300 hover:scale-105"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-4 md:gap-5 w-full text-center lg:text-start">
          <h1 className="font-din-bold text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
            {t("title")}
          </h1>

          <p className="font-din-regular text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
            {t("subtitle")}
          </p>

          {/* CTA Button */}
          <div className="mt-2">
            <ActiveButton
              onClick={() => router.push(`/${lang}/innovators/registration/1`)}
              className="w-full sm:w-auto"
            >
              <div
                className="flex items-center justify-center gap-2"
                dir={isArabic ? "rtl" : "ltr"}
              >
                <p className="font-din-bold text-base text-white">
                  {t("registration")}
                </p>
                {isArabic ? (
                  <CircleArrowLeft className="size-5 text-white" />
                ) : (
                  <CircleArrowRight className="size-5 text-white" />
                )}
              </div>
            </ActiveButton>
          </div>
        </div>
      </div>

      {/* Right Cards Section */}
      <div
        dir={isArabic ? "rtl" : "ltr"}
        className="lg:col-span-7 h-[60dvh] md:h-[70dvh] flex gap-6 md:gap-8 overflow-hidden"
      >
        {/* First Animated Column */}
        <div className="flex-1">
          <AnimatedList
            direction="down"
            speed="normal"
            pauseOnHover={true}
            layout="vertical"
            items={MockInnovatorsData}
            renderItem={(innovator) => (
              <CardInnovators key={innovator.id} innovator={innovator} />
            )}
          />
        </div>

        {/* Second Animated Column */}
        <div className="flex-1 hidden md:block">
          <AnimatedList
            direction="up"
            speed="slow"
            pauseOnHover={true}
            layout="vertical"
            items={MockInnovatorsData}
            renderItem={(innovator) => (
              <CardInnovators key={innovator.id} innovator={innovator} />
            )}
          />
        </div>
      </div>
    </div>
  );
};