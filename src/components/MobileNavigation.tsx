"use client";

import useIsArabic from "@/hooks/useIsArabic";
import Image from "next/image";
import React from "react";

export const MobileNavigation = () => {
  const isArabic = useIsArabic();

  return (
    <header className="mobile-header hidden lg:block" dir={isArabic ? "rtl" : "ltr"}>
      <Image
        src="./assets/icons/logo.svg"
        alt="logo"
        width={52}
        height={52}
        className="h-auto"
      />
    </header>
  );
};
