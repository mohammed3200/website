"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";
import { cn } from "@/lib/utils";
import useLanguage from "@/hooks/uselanguage";
import { useTranslations } from "next-intl";

export const NavBar = () => {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const isDesktopOrTablet = useMedia("(min-width: 640px)", true);

  const navigationItems = [
    { title: t("home"), href: `/${lang}` },
    { title: t("entrepreneurship"), href: `/${lang}/entrepreneurship` },
    { title: t("incubators"), href: `/${lang}/incubators` },
    { title: t("projects"), href: `/${lang}/projects` },
    { title: t("contact"), href: `/${lang}/contact` },
  ];

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    opacity: 0,
  });

  const handleMouseEnter = (ref: HTMLLIElement | null) => {
    if (!ref) return;
    const { width } = ref.getBoundingClientRect();
    setPosition({
      left: isDesktopOrTablet ? ref.offsetLeft : 0,
      top: isDesktopOrTablet ? 0 : ref.offsetTop,
      width,
      opacity: 1,
    });
  };

  return (
    <ul
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      className="relative mx-auto flex flex-col sm:flex-row w-fit border-none p-1 items-center"
    >
      {navigationItems.map((item, index) => (
        <Tab key={index} href={item.href} onMouseEnter={handleMouseEnter}>
          <p className={cn("font-din-bold text-sm", pathname === item.href && `sm:text-primary ${!isDesktopOrTablet && "text-white"}` )}>
            {item.title}
          </p>
        </Tab>
      ))}
      {isDesktopOrTablet ? (
        <CursorDesktop position={position} />
      ) : (
        <CursorMobile position={position} />
      )}
    </ul>
  );
};

interface TabProps {
  href: string;
  children: React.ReactNode;
  onMouseEnter: (ref: HTMLLIElement | null) => void;
}

const Tab = ({ href, children, onMouseEnter }: TabProps) => {
  const ref = useRef<HTMLLIElement | null>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => onMouseEnter(ref.current)}
      className="relative z-10 block cursor-pointer px-3 py-1.5 uppercase text-light-100 md:px-5 md:py-3 md:text-base"
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};

interface CursorProps {
  position: {
    left: number;
    width: number;
    opacity: number;
    top: number;
  };
}

const CursorDesktop = ({ position }: CursorProps) => (
  <motion.li
    animate={{ left: position.left, width: position.width, opacity: position.opacity }}
    className="absolute z-0 h-1 rounded-full bg-primary translate-y-4"
  />
);

const CursorMobile = ({ position }: CursorProps) => (
  <motion.li
    animate={{
      top: position.top, // Use height of first item
      width: position.width,
      opacity: 1,
    }}
    className="absolute z-0 h-7 rounded-full bg-primary scale-125"
  />
);