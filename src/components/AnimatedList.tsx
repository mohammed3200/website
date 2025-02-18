"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedListProps<T> {
  direction?: "left" | "right" | "up" | "down";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  layout?: "horizontal" | "vertical";
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

export const AnimatedList = <T,>({
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  layout = "horizontal",
  items,
  renderItem,
}: AnimatedListProps<T>) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  },);

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
      } else if (direction === "right") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      } else if (direction === "up") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else if (direction === "down") {
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
        "scroller relative z-20 overflow-hidden",
        layout === "horizontal"
          ? "max-md:w-svw max-w-7xl [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]"
          : "h-[500px] [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-4 py-10 w-max flex-nowrap",
          layout === "vertical" && "flex-col h-max",
          start && layout === "vertical" ? "animate-scroll-vertical" : "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, index) => (
          <li
            className={cn(
              "relative md:px-7 px-4",
              layout === "vertical" && "w-full"
            )}
            key={index}
          >
            {renderItem(item,index)}
          </li>
        ))}
      </ul>
    </div>
  );
};
