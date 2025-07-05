/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header, MobileNavigation } from "@/components";
import { Toaster } from "@/components/ui/toaster";
import { BackgroundBeams } from "@/components/ui/background-beams";

export const dynamic = "force-dynamic";

interface RootLayoutProps {
  children: React.ReactNode;
  params: any; // Specify the expected locale types
}

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  // Await the params to access locale
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client side
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <BackgroundBeams className="-z-10" />
            <main className="flex h-screen">
              <section className="flex h-full flex-1 flex-col">
                <MobileNavigation />
                <Header />
                {/* FIXME: Build and design a news ticker */}
                <div className="main-content">{children}</div>
              </section>
              <Toaster />
            </main>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
