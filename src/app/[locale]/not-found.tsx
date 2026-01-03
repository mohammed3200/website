"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InterfaceImage } from "@/constants";
import useLanguage from "@/hooks/use-language";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import arMessages from "../../../messages/ar.json";

export default function NotFound() {
    return (
        <NextIntlClientProvider locale="ar" messages={arMessages} timeZone="Africa/Tripoli">
            <NotFoundContent />
        </NextIntlClientProvider>
    );
}

function NotFoundContent() {
    const { isArabic, lang } = useLanguage();
    const t = useTranslations("NotFound");
    const router = useRouter();

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background">
            <BackgroundBeams className="-z-10 opacity-40" />
            <main className="flex h-screen w-full items-center justify-center p-4">
                <div
                    className="flex flex-col items-center justify-center gap-6 text-center z-10 max-w-lg mx-auto"
                    dir={isArabic ? "rtl" : "ltr"}
                >
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                        <Image
                            src={InterfaceImage.Error404}
                            alt="404 Not Found"
                            width={300}
                            height={300}
                            className="object-contain relative z-10 drop-shadow-xl"
                            priority
                        />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight lg:text-6xl text-primary">
                            404
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {t("title")}
                        </h2>
                    </div>

                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                        {t("description")}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
                        <Button
                            variant="default"
                            size="lg"
                            onClick={() => router.push(`/${lang}`)}
                            className="gap-2 min-w-[140px]"
                        >
                            <span className="font-semibold">{t("homePage")}</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => router.back()}
                            className="gap-2 min-w-[140px]"
                        >
                            <span className="font-semibold">{isArabic ? "العودة" : "Go Back"}</span>
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
