import { Faq } from "@/components/faq";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
    const t = await getTranslations({ locale, namespace: "Faq" });

    return {
        title: t("title"),
        description: t("subtitle"),
    };
}

export default function FaqPage() {
    return (
        <main className="min-h-screen pt-20">
            <Faq />
        </main>
    );
}
