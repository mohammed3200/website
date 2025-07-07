import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header, MobileNavigation } from "@/components";
import { Toaster } from "@/components/ui/toaster";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { AppProviders } from "@/components/providers/app-providers";

export const dynamic = "force-dynamic";

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: 'en' | 'ar' }; // Specify the expected type
}

export default async function LocaleLayout({
  children,
  params,
}: RootLayoutProps) {
  // Access locale directly from params
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale}>
      <body>
        <AppProviders messages={messages} locale={locale}>
          <BackgroundBeams className="-z-10" />
          <main className="flex h-screen">
            <section className="flex h-full flex-1 flex-col">
              <MobileNavigation />
              <Header />
              <div className="main-content">{children}</div>
            </section>
            <Toaster />
          </main>
        </AppProviders>
      </body>
    </html>
  );
}