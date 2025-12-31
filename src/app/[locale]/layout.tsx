import { Toaster } from "@/components/ui/toaster";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ResponsiveNavbar } from "@/components/navigation";
import { Footer } from "@/components";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export const dynamic = "force-dynamic";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function LocaleLayout({
    children,
}: RootLayoutProps) {
    const messages = await getMessages();
    const locale = await getLocale();

    return (
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Tripoli">
            <BackgroundBeams className="-z-10" />
            <main className="flex min-h-screen flex-col">
                <ResponsiveNavbar />
                <div className="main-content flex-1">{children}</div>
                <Footer />
            </main>
            <Toaster />
        </NextIntlClientProvider>
    );
}