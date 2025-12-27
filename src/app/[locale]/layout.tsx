'use client';

import { Toaster } from "@/components/ui/toaster";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ResponsiveNavbar } from "@/components/navigation";

export const dynamic = "force-dynamic";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function LocaleLayout({
    children,
}: RootLayoutProps) {
    return (
        <>
            <BackgroundBeams className="-z-10" />
            <main className="flex h-screen">
                <section className="flex h-full flex-1 flex-col">
                    <ResponsiveNavbar />
                    <div className="main-content">{children}</div>
                </section>
            </main>
            <Toaster />
        </>
    );
}