"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

import { use } from "react";

export default function CompletePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = use(params);
    const t = useTranslations("collaboratingPartners");

    return (
        <div className="container max-w-3xl mx-auto py-20 px-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>

                <h1 className="text-3xl font-din-bold text-gray-900 mb-4">
                    {t("success_title") || "Registration Completed!"}
                </h1>

                <p className="text-gray-600 font-din-regular text-lg mb-8 max-w-lg mx-auto">
                    {t("success_message") || "Thank you for registering. Your details have been submitted successfully. We will review your application and get back to you soon."}
                </p>

                <div className="flex justify-center gap-4">
                    <Button asChild className="gap-2 bg-orange-500 hover:bg-orange-600">
                        <Link href={`/${locale}`}>
                            <Home className="w-4 h-4" />
                            <span className="font-din-regular">{t("home") || "Back to Home"}</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
