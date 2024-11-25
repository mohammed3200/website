"use client";

import Link from "next/link";
import React, { useRef, useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";
import { useTranslations } from "next-intl";

import { motion } from "framer-motion";

import useLanguage from "@/hooks/uselanguage";

import { cn } from "@/lib/utils";

export const NavBar = () => {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const isDesktopOrTablet = useMedia("(min-width: 640px)", true);

  const navigationItems = useMemo(
    () => [
      { title: t("home"), href: `/${lang}` },
      { title: t("entrepreneurship"), href: `/${lang}/entrepreneurship` },
      { title: t("incubators"), href: `/${lang}/incubators` },
      { title: t("projects"), href: `/${lang}/projects` },
      { title: t("contact"), href: `/${lang}/contact` },
    ],
    [lang, t]
  );

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    opacity: isDesktopOrTablet ? 0 : 1,
  });

  // Effect to set initial top position of the first item
  useEffect(() => {
    if (navigationItems.length > 0) {
      const firstItem = document.querySelector("li");
      if (firstItem && !isDesktopOrTablet) {
        const { top } = firstItem.getBoundingClientRect();
        setPosition((prev) => ({
          ...prev,
          top,
        }));
      }
    }
  }, [navigationItems, isDesktopOrTablet]);

  const handleClick = (ref: HTMLLIElement | null) => {
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
      onMouseLeave={() =>
        setPosition((pv) => ({
          ...pv,
          opacity: isDesktopOrTablet ? 0 : pv.opacity,
        }))
      } // Update opacity only for desktop
      className={cn(
        "relative mx-auto flex flex-col sm:flex-row w-fit border-none p-1",
        !isDesktopOrTablet && "items-center justify-center"
      )}
    >
      {navigationItems.map((item, index) => (
        <Tab
          key={index}
          href={item.href}
          onClick={handleClick}
          isDesktop={isDesktopOrTablet}
        >
          <p
            className={cn(
              "font-din-bold text-sm",
              pathname === item.href &&
                `sm:text-primary ${!isDesktopOrTablet && "text-white"}`
            )}
          >
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
  onClick: (ref: HTMLLIElement | null) => void;
  isDesktop: boolean;
}

const Tab = ({ href, children, onClick, isDesktop }: TabProps) => {
  const ref = useRef<HTMLLIElement | null>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={isDesktop ? () => onClick(ref.current) : undefined} // Use onMouseEnter for desktop
      onClick={!isDesktop ? () => onClick(ref.current) : undefined} // Use onClick for mobile
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
    animate={{
      left: position.left,
      width: position.width,
      opacity: position.opacity,
    }}
    className="absolute z-0 h-1 rounded-full bg-primary sm:translate-y-9 scale-80"
  />
);

const CursorMobile = ({ position }: CursorProps) => (
  <motion.li
    animate={{
      top: position.top, // Use the updated top value
    }}
    className="absolute z-0 w-full h-7 rounded-full bg-primary scale-125 translate-y-1"
  />
);
