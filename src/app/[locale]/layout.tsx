import { Toaster } from "@/components/ui/toaster";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ResponsiveNavbar } from "@/components/navigation";
import { Footer } from "@/components";
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Almarai as AlmaraiGoogle } from 'next/font/google';
import { AppProviders } from '@/components/providers/app-providers';
import { QueryProvider } from '@/components';
import '../globals.css';

const almarai = AlmaraiGoogle({
    subsets: ['arabic'],
    weight: ['300', '400', '700', '800'],
    variable: '--font-almarai',
});

export const dynamic = "force-dynamic";

interface RootLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params,
}: RootLayoutProps) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale);

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as 'ar' | 'en')) {
        notFound();
    }

    // Load messages directly for the specific locale to avoid context mismatches
    let messages;
    try {
        messages = (await import(`../../../messages/${locale}.json`)).default;
    } catch {
        notFound();
    }

    const direction = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <html lang={locale} dir={direction} className={almarai.variable}>
            <body className="font-sans">
                <AppProviders>
                    <QueryProvider>
                        <NextIntlClientProvider
                            locale={locale}
                            messages={messages}
                            timeZone="Africa/Tripoli"
                        >
                            <BackgroundBeams className="-z-10" />
                            <main className="flex min-h-screen flex-col">
                                <ResponsiveNavbar />
                                <div className="main-content flex-1">{children}</div>
                                <Footer />
                            </main>
                            <Toaster />
                        </NextIntlClientProvider>
                    </QueryProvider>
                </AppProviders>
            </body>
        </html>
    );
}