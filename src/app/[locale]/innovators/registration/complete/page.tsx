"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import useLanguage from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function RegistrationCompletePage() {
    const { lang } = useLanguage();
    const t = useTranslations("CreatorsAndInnovators");

    return (
        <div className="w-full min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-green-100 p-4">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-din-bold text-gray-900 mb-4">
                    {t("success_title")}
                </h1>

                <p className="text-gray-600 font-din-regular mb-8">
                    {t("success_message")}
                </p>

                <div className="space-y-3">
                    <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                        <Link href={`/${lang}/innovators`}>
                            {t("backToInnovators")}
                        </Link>
                    </Button>

                    <Button asChild variant="outline" className="w-full">
                        <Link href={`/${lang}`}>
                            {t("backToHome")}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
