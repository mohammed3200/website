"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";


import useLanguage from "@/hooks/uselanguage";

import { TranslateButton } from "./TranslateButton";
import { NavBar } from "./NavBar";

export const Header = () => {
  const {  isArabic } = useLanguage();

  return (
    <header className="header" dir={isArabic ? "rtl" : "ltr"}>
      {/* Logo */}
      <div>
        <Link href="/">
          <Image
            src={
              isArabic
                ? "./assets/icons/logo-full.svg"
                : "./assets/icons/logo-english-full.svg"
            }
            alt="logo"
            width={170}
            height={170}
            className="hidden h-auto md:block"
          />
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={80}
            height={80}
            className="md:hidden"
          />
        </Link>
      </div>
      {/* Menu Items */}
      <div>
        <NavBar />
      </div>
      {/* Translate button */}
      <div>
        <TranslateButton />
      </div>
    </header>
  );
};