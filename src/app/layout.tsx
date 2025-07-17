import { QueryProvider } from "@/components";
import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers"; // Adjust import path
import { getLocale, getMessages } from "next-intl/server"; // Add next-intl imports

// TODO: change Metadata
export const metadata: Metadata = {
  title: "Entrepreneurship and Business Incubators Center - Misurata",
  description: "Entrepreneurship and incubation of projects and businesses for creators and innovators",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang="en">
      <body>
        <AppProviders messages={messages} locale={locale}>
          <QueryProvider>{children}</QueryProvider>
        </AppProviders>
      </body>
    </html>
  );
}
