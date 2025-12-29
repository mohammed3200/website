import { Toaster } from "@/components/ui/toaster";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ResponsiveNavbar } from "@/components/navigation";
import { Footer } from "@/components";

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
            <main className="flex min-h-screen flex-col">
                <ResponsiveNavbar />
                <div className="main-content flex-1">{children}</div>
                <Footer />
            </main>
            <Toaster />
        </>
    );
}