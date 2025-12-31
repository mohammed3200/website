import { QueryProvider } from '@/components';
import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { getLocale } from 'next-intl/server';
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
  let locale;
  try {
    locale = await getLocale();
  } catch {
    locale = 'ar';
  }

  const direction = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={direction}>
      <body className={`${almarai.variable} font-sans`}>
        <AppProviders>
          <QueryProvider>{children}</QueryProvider>
        </AppProviders>
      </body>
    </html>
  );
}
