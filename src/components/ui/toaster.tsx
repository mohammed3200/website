"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CircleCheck, CircleX } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, success, error, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              <div className="flex flex-row gap-4">
                {title && <ToastTitle>{title}</ToastTitle>}
                {success && <CircleCheck color="#00ff80" />}
                {error && <CircleX color="#ff4233" />}
              </div>
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
