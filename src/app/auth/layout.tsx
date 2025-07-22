// src/app/admin/layout.tsx
"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <BackgroundBeams className="-z-10" />
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}