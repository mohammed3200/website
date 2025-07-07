"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

export function AppProviders({
  children,
  messages,
  locale, // Add locale prop
}: {
  children: ReactNode;
  messages: any;
  locale: string; // Add type for locale
}) {
  return (
    <SessionProvider>
      {/* Pass locale to NextIntlClientProvider */}
      <NextIntlClientProvider 
      locale={locale} 
      messages={messages} 
      timeZone="Africa/Tripoli" // Add this line
      >
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}