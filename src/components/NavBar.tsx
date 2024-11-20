"use client";

import Link from "next/link";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


interface NavBarProps {
  navigationItems: { title: string; href: string }[];
}

export const NavBar = ({ navigationItems }: NavBarProps) => {
  const pathname = usePathname();
  

  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  return (
    <ul
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit 
  rounded-full border-none p-1 items-center"
    >
      {navigationItems.map((item, index) => (
        <Tab key={index.toString()} href={item.href} setPosition={setPosition}>
          <p className={cn(
            "font-din-bold text-sm",
            pathname === item.href && "text-primary"
            )}>{item.title}</p>
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
};

interface TabProps {
  href: string;
  children: React.ReactNode;
  setPosition: ({
    left,
    width,
    opacity,
  }: {
    left: number;
    width: number;
    opacity: number;
  }) => void;
}

const Tab = ({ href, children, setPosition }: TabProps) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5
                uppercase text-light-100 md:px-5 md:py-3
                md:text-base"
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
  };
}

const Cursor = ({ position }: CursorProps) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-1 rounded-full bg-primary translate-y-4 scale-90"
    />
  );
};
