import { QueryProvider } from '@/components';
import type { Metadata } from 'next';
import '../globals.css';
import { AppProviders } from '@/components/providers/app-providers';
import { Toaster } from 'sonner';
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
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProviders>
          <QueryProvider>
            {children}
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </AppProviders>
      </body>
    </html>
  );
}
