import { QueryProvider } from '@/components';
import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers'; // Adjust import path
import { getLocale, getMessages } from 'next-intl/server';
import { Almarai as AlmaraiGoogle } from 'next/font/google';

const almarai = AlmaraiGoogle({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-almarai',
});

// TODO: change Metadata
export const metadata: Metadata = {
  title: 'Entrepreneurship and Business Incubators Center - Misurata',
  description:
    'Entrepreneurship and incubation of projects and businesses for creators and innovators',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Force cache invalidation
  let locale;
  try {
    locale = await getLocale();
  } catch {
    locale = 'ar';
  }

  // Ensure locale has a value
  if (!locale) {
    locale = 'ar';
  }
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch {
    messages = {};
  }

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body className={`${almarai.variable} font-sans`}>
        <AppProviders messages={messages} locale={locale}>
          <QueryProvider>{children}</QueryProvider>
        </AppProviders>
      </body>
    </html>
  );
}
