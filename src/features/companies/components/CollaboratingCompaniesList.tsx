/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CardCompanies } from "./CardCompanies";
import { MockCompaniesData } from "@/mock";
import useLanguage from "@/hooks/uselanguage";

interface CollaboratingCompaniesListProps {
  items?: {
    quote: string;
    name: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const CollaboratingCompaniesList = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: CollaboratingCompaniesListProps) => {
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
      if (direction === "left") {
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
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller max-md:w-svw relative z-20  max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-10 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {MockCompaniesData.map((item) => (
          <li className="relative md:px-7 px-4" key={item.id}>
            <CardCompanies
              CompaniesName={
                isArabic ? item.company_name_ar : item.company_name_en
              }
              ExperienceProvided={
                isArabic
                  ? item.experience_provided_ar
                  : item.experience_provided_en
              }
              companyImage={item.company_image}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
