import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header, MobileNavigation } from "@/components";
import { Toaster } from "@/components/ui/toaster";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { AppProviders } from "@/components/providers/app-providers";
import { Almarai } from "next/font/google"; // Import Almarai

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"], // Select weights you need
  variable: "--font-almarai", // Define a CSS variable
});

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
  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <body className={`${almarai.variable} font-sans`}>
        <AppProviders messages={messages} locale={locale}>
          <BackgroundBeams className="-z-10" />
          <main className="flex h-screen">
            <section className="flex h-full flex-1 flex-col">
              <MobileNavigation />
              <Header />
              <div className="main-content">{children}</div>
            </section>
          </main>
        </AppProviders>
        <Toaster />
      </body>
    </html>
  );
}