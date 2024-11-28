/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Footer, Header, MobileNavigation } from "@/components";
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
        <NextIntlClientProvider messages={messages}>
          <BackgroundBeams className="-z-10" />
          <main className="flex h-screen">
            <section className="flex h-full flex-1 flex-col">
              <MobileNavigation />
              <Header />
              <div className="main-content">{children}</div>
              <Footer />
            </section>
            <Toaster />
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
