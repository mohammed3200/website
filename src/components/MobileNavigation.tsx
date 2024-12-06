"use client";

import React, { useState } from "react";
import Image from "next/image";
import useLanguage from "@/hooks/uselanguage";

import { MainLogo, IconsInterface } from "@/constants";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { TranslateButton } from "./buttons";
import { NavBar } from "./NavBar";

export const MobileNavigation = () => {
  const { isArabic } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="mobile-header" dir={isArabic ? "rtl" : "ltr"}>
      <Image
        src={MainLogo.Logo}
        alt="logo"
        width={50}
        height={50}
        className="h-auto"
      />
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
