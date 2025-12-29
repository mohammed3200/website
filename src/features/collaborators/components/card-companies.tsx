import React from "react";
import { BackGroundEffect } from "@/constants";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useLanguage from "@/hooks/use-language";

interface CardCompaniesProps {
  className?: string;
  CompaniesName: string;
  // FIXME: Experience Provided Incomplete
  ExperienceProvided: string;
  // FIXME: company Image Incomplete
  companyImage: string;
}
// FIXME: Reform and amend the cooperative partners card, and because the partner's image and recipe is not repeated
export const CardCompanies = ({
  className,
  CompaniesName,
  ExperienceProvided,
  companyImage,
}: CardCompaniesProps) => {
  const { isArabic } = useLanguage();
  return (
    <div
      className={cn("relative size-40 md:size-60", className)}
      dir={isArabic ? "ltr" : "rlt"}
    >
      <div
        className={cn(
          "absolute top-0 size-1/2 scale-110 md:-translate-y-9 -translate-y-7",
          isArabic
            ? "left-0 md:-translate-x-12 -translate-x-8"
            : "right-0 md:translate-x-14 translate-x-8"
        )}
        style={{
          backgroundImage: `url(${BackGroundEffect.TransparentCircle})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full p-2 md:p-3">
          <Image
            src={companyImage}
            alt={CompaniesName}
            width={500}
            height={500}
            className="w-full h-full object-content rounded-full p-2"
          />
        </div>
      </div>
      <div
        className={cn(
          "w-full h-full scale-[0.85] justify-center overflow-hidden rounded-2xl",
          isArabic ? "" : "transform scale-x-[-1]"
        )}
        style={{
          backgroundImage: `url(${BackGroundEffect.CardCurve})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        dir={isArabic ? "ltr" : "rlt"}
      >
        <div
          className={cn(
            "w-full h-full flex flex-col justify-center md:px-4 px-2 md:py-2 pt-4"
          )}
          dir={isArabic ? "ltr" : "rlt"}
        >
          <p
            className={cn(
              "font-din-bold text-base max-md:text-sm mt-2.5 md:mb-2 break-all w-full",
              isArabic ? "text-right" : "text-left transform scale-x-[-1]"
            )}
          >
            {CompaniesName}
          </p>
          <p
            className={cn(
              "font-din-regular md:text-sm text-xs max-lg:max-w-sm w-full",
              isArabic ? "text-right" : "text-left transform scale-x-[-1]"
            )}
          >
            {ExperienceProvided}
          </p>
        </div>
        <div className="absolute bottom-0 w-full h-2 bg-gradient-to-b from-transparent via-[#fd7724] to-primary rounded-b-full" />
      </div>
    </div>
  );
};
