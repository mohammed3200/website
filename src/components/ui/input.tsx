import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-slate-200 dark:border-slate-700",
          "bg-white dark:bg-slate-950",
          "px-4 py-2.5",
          "text-sm md:text-base",
          "text-slate-900 dark:text-slate-100",
          "placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "shadow-sm",
          "transition-all duration-200",
          "hover:border-slate-300 dark:hover:border-slate-600",
          "focus:border-primary focus:ring-4 focus:ring-primary/10",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "rtl:text-right",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
