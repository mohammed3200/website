"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useMedia } from "react-use";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useNavigationItems } from "@/constants";
import useLanguage from "@/hooks/uselanguage";

export const NavBar = () => {
  const pathname = usePathname();
  const isDesktop = useMedia("(min-width: 640px)", true);
  const { isEnglish } = useLanguage()

  const navigationItems = useNavigationItems();

  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    opacity: isDesktop ? 0 : 1,
  });

  const handleClick = (ref: HTMLLIElement | null) => {
    if (!ref) return;
    const { width } = ref.getBoundingClientRect();
    setPosition({
      left: isDesktop ? ref.offsetLeft : 0,
      top: isDesktop ? 0 : ref.offsetTop,
      width,
      opacity: 1,
    });
  };

  return (
    <ul
      onMouseLeave={() =>
        setPosition((pv) => ({
          ...pv,
          opacity: isDesktop ? 0 : pv.opacity,
        }))
      } // Update opacity only for desktop
      className={cn(
        "relative mx-auto flex flex-col sm:flex-row w-fit border-none py-2",
        !isDesktop && "items-center justify-center"
      )}
    >
      {navigationItems.map((item, index) => (
        <Tab
          key={index}
          href={item.href}
          onClick={handleClick}
          isDesktop={isDesktop}
        >
          <p
            className={cn(
              "font-din-bold text-[1rem]",
              pathname === item.href &&
              "sm:text-primary max-md:text-white",
              // TODO: Fix page titles in English
              isEnglish && "md:text-[0.86rem]"
            )}
          >
            {item.title}
          </p>
        </Tab>
      ))}
      {isDesktop ? (
        <CursorDesktop position={position} />
      ) : (
        // FIXME: Fix cursor position issue
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
      className="relative z-10 block cursor-pointer py-1.5 uppercase text-light-100 md:px-5 md:py-3 md:text-base"
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
    className="absolute z-0 h-1 rounded-full bg-primary sm:translate-y-10 scale-80"
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
