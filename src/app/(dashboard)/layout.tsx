import { QueryProvider } from '@/components';
import type { Metadata } from 'next';
import '../globals.css';
import { AppProviders } from '@/components/providers/app-providers';

// TODO: change Metadata
export const metadata: Metadata = {
  title: 'Entrepreneurship and Business Incubators Center - Misurata',
  description:
    'Entrepreneurship and incubation of projects and businesses for creators and innovators',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProviders>
          <QueryProvider>{children}</QueryProvider>
        </AppProviders>
      </body>
    </html>
  );
}
