"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BackGroundEffect } from "@/constants"

import useLanguage from "@/hooks/uselanguage";


interface ActiveButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  containerClassName?: string;
  icon?: string;
}

export const ActiveButton = ({
  children,
  onClick,
  className,
  containerClassName,
  icon,
}: ActiveButtonProps) => {
    const { isArabic } = useLanguage();
  return (
    <div
      className={cn(
        "w-fit overflow-hidden p-1 rounded-full hover:scale-110 transition-all duration-500",
        className
      )}
      style={{
        backgroundImage: `url(${BackGroundEffect.GlassBackground})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <button
        className={cn(
          "flex justify-center items-center h-full bg-gradient-to-r from-[#fe7921] to-[#fe7011] w-full cursor-pointer px-5 py-2 relative rounded-full",
          isArabic ? "flex-row" : "flex-row-reverse",
          containerClassName,
        )}
        onClick={onClick}
      >
        <div>{children}</div>
        {icon && (
          <Image
            src={icon}
            alt="icon"
            width={24}
            height={24}
            className="size-6 object-contain z-10 text-white"
          />
        )}
      </button>
    </div>
  );
};