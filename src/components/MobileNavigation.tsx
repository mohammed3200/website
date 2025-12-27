"use client";

import React, { useState } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/use-language";

import { MainLogo, IconsInterface } from "@/constants";

import { NavBar, TranslateButton } from "@/components";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export const MobileNavigation = () => {
  const { isArabic } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="mobile-header" dir={isArabic ? "rtl" : "ltr"}>
      {/* TODO: Add college logo
       TODO: Change the center's logo to show the name of the Entrepreneurship Center and Business Incubators */}
      <div className="flex justify-between items-center p-2 w-[90%]">
        <Image
          src={
            isArabic
              ? MainLogo.CenterLogoSmall
              : MainLogo.CenterLogoSmallEnglish
          }
          alt="Center Logo"
          width={80}
          height={80}
          className="object-content"
        />
        <Image
          src={
            isArabic
              ? MainLogo.CollegeLogoSmall
              : MainLogo.CollegeLogoSmallEnglish
          }
          alt="College Logo"
          width={100}
          height={100}
          className="object-content"
        />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image src={IconsInterface.Menu} alt="Menu" width={30} height={30} />
        </SheetTrigger>
        <SheetContent
          className="shad-sheet h-screen px-3 flex flex-col"
          side={isArabic ? "left" : "right"}
        >
          <SheetTitle className="pt-2">
            <TranslateButton />
          </SheetTitle>
          <nav className="mobile-nav flex-1">
            <Separator className="mb-4 bg-light-200/20" />
            <NavBar />
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};
