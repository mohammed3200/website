"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useLanguage from "@/hooks/use-language";

// Extend motion.button props to allow all standard button props handling + motion props
type ActiveButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  containerClassName?: string;
  icon?: string;
  disabled?: boolean;
} & React.ComponentProps<typeof motion.button>;

export const ActiveButton = ({
  children,
  onClick,
  className,
  containerClassName,
  icon,
  disabled = false,
  ...props
}: ActiveButtonProps) => {
  const { isArabic } = useLanguage();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      className={cn(
        "relative group isolate",
        "flex items-center justify-center gap-3",
        "px-6 py-2.5 rounded-full",
        "bg-gradient-to-r from-orange-400 to-orange-600",
        "shadow-lg shadow-orange-500/20",
        "transition-all duration-300",
        "hover:shadow-orange-500/30",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none",
        isArabic ? "flex-row" : "flex-row-reverse", // Maintain icon position logic
        className
      )}
      {...props}
    >
      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] animate-shimmer" />

      {/* Button Content */}
      <div className={cn("font-din-bold text-white text-base", containerClassName)}>
        {children}
      </div>

      {/* Optional Icon */}
      {icon && (
        <div className="relative size-6 shrink-0">
          <Image
            src={icon}
            alt="icon"
            fill
            className="object-contain brightness-0 invert" // Ensure icon is white
          />
        </div>
      )}
    </motion.button>
  );
};