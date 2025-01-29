/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CardInnovators } from "./card-innovators";
import { MockCompaniesData } from "@/mock";
import useLanguage from "@/hooks/uselanguage";

interface VerticalScrollingCompaniesListProps {
  items?: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "top" | "bottom";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const VerticalScrollingCompaniesList = ({
  items,
  direction = "top",
  speed = "fast",
  pauseOnHover = true,
  className,
}: VerticalScrollingCompaniesListProps) => {
  const { isArabic } = useLanguage();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      scrollerRef.current.style.setProperty(
        "--animation-iteration-count",
        "infinite"
      );

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "top") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "15s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "60s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller h-full relative z-20 max-h-7xl overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex flex-col min-w-full shrink-0 gap-4 px-4 flex-nowrap",
          start && "animate-scroll-vertical",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {MockCompaniesData.map((item, index) => (
          <li className="relative px-2" key={item.id}>
            {/* <CardInnovators
              CompaniesName={
                isArabic ? item.company_name_ar : item.company_name_en
              }
              ExperienceProvided={
                isArabic
                  ? item.experience_provided_ar
                  : item.experience_provided_en
              }
              companyImage={item.company_image}
            /> */}
            <div className="w-44 max-md:w-36 h-36 rounded-md items-center text-black text-base bg-red-500">
              {index + 1}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};