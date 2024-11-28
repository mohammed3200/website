"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { Marker } from "./Marker";
import useLanguage from "@/hooks/uselanguage";

interface AmazingButtonProps {
  children: React.ReactNode;
  icon?: string;
  href?: string;
  containerClassName?: string;
  onClick?: () => void;
  markerFill?: string;
}

export const AmazingButton = ({
  icon,
  children,
  href,
  containerClassName,
  onClick,
  markerFill,
}: AmazingButtonProps) => {
  const { isArabic } = useLanguage();
  const Inner = () => (
    <>
      <span
        className="relative flex items-center min-h-[60px]
       px-4 g4 rounded-2xl inner-before group-hover:before:opacity-100 overflow-hidden"
      >
        <span className="absolute -left-[1px]">
          <Marker markerFill={markerFill} />
        </span>
        {icon && (
          <Image
            src={icon}
            alt={icon}
            width={24}
            height={24}
            className="size-10 mr-5 object-contain z-10"
          />
        )}
        <span 
        className="relative z-2 font-din-bold uppercase text-p1 text-zinc-100">
          {children}
          </span>
      </span>
      <span className="glow-before glow-after" />
    </>
  );
  return href ? (
    <Link
      href={href}
      className={cn(
        "relative p-0.5 g5 rounded-2xl shadow-500 group",
        containerClassName
      )}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Inner />
    </Link>
  ) : (
    <button
      className={cn(
        "relative p-0.5 g5 rounded-2xl shadow-500 group",
        containerClassName
      )}
      onClick={onClick}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Inner />
    </button>
  );
};
