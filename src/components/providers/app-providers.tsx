/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";


import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";

export function AppProviders({
  children,
  messages,
  locale,
}: {
  children: ReactNode;
  messages: any;
  locale: string;
}) {
  return (
    <SessionProvider>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Africa/Tripoli"
      >
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  );
}