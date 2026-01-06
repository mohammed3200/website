import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border-2 border-slate-200 dark:border-slate-700",
        "bg-stone-50 dark:bg-stone-950",
        "px-4 py-3",
        "text-sm md:text-base",
        "text-slate-900 dark:text-slate-100",
        "placeholder:text-slate-400 dark:placeholder:text-slate-500",
        "shadow-sm",
        "transition-all duration-200",
        "hover:border-slate-300 dark:hover:border-slate-600",
        "focus:border-primary focus:ring-4 focus:ring-primary/10",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-900",
        "resize-y text-start",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
