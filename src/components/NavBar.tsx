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
  const isDesktopOrTable = useMedia("(min-width: 640px)", true);

  const navigationItems = [
    { title: t("home"), href: `/${lang}` },
    { title: t("entrepreneurship"), href: `/${lang}/entrepreneurship` },
    { title: t("incubators"), href: `/${lang}/incubators` },
    { title: t("projects"), href: `/${lang}/projects` },
    { title: t("contact"), href: `/${lang}/contact` },
  ];
  

  const [positionDesktopOrTable, setPositionDesktopOrTable] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [positionMobile, setPositionMobile] = useState({
    top: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        if (isDesktopOrTable) {
          setPositionDesktopOrTable((pv) => ({
            ...pv,
            opacity: 0,
          }));
        }
      }}
      className="relative mx-auto flex flex-col 
      sm:flex-row w-fit border-none p-1 items-center"
    >
      {navigationItems.map((item, index) => (
        <Tab
          key={index.toString()}
          href={item.href}
          setPositionDesktopOrTable={setPositionDesktopOrTable}
          isDesktopOrTable={isDesktopOrTable}
          setPositionMobile={setPositionMobile}
        >
          <p
            className={cn(
              "font-din-bold text-sm",
              pathname === item.href && "sm:text-primary"
            )}
          >
            {item.title}
          </p>
        </Tab>
      ))}
      {isDesktopOrTable ? (
        <CursorDesktopOrTable position={positionDesktopOrTable} />
      ) : (
        <CursorMobile position={positionMobile} />
      )}
    </ul>
  );
};

interface TabProps {
  href: string;
  children: React.ReactNode;
  setPositionDesktopOrTable: ({
    left,
    width,
    opacity,
  }: {
    left: number;
    width: number;
    opacity: number;
  }) => void;
  setPositionMobile: ({
    top,
    width,
    opacity,
  }: {
    top: number;
    width: number;
    opacity: number;
  }) => void;
  isDesktopOrTable: boolean;
}

const Tab = ({
  href,
  children,
  setPositionDesktopOrTable,
  setPositionMobile,
  isDesktopOrTable,
}: TabProps) => {
  const ref = useRef<HTMLLIElement | null>(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();

        if (isDesktopOrTable) {
          setPositionDesktopOrTable({
            left: ref.current.offsetLeft,
            width,
            opacity: 1,
          });
        } else {
          setPositionMobile({
            top: ref.current.offsetTop,
            width,
            opacity: 1,
          });
        }
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5
                uppercase text-light-100 md:px-5 md:py-3
                md:text-base"
    >
      <Link href={href}>{children}</Link>
    </li>
  );
};

interface CursorDesktopOrTableProps {
  position: {
    left: number;
    width: number;
    opacity: number;
  };
}

const CursorDesktopOrTable = ({ position }: CursorDesktopOrTableProps) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-1 rounded-full bg-primary translate-y-4"
    />
  );
};

interface CursorMobileProps {
  position: {
    top: number;
    width: number;
    opacity: number;
  };
}

const CursorMobile = ({ position }: CursorMobileProps) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 w-full rounded-full bg-primary scale-125"
    />
  );
};
