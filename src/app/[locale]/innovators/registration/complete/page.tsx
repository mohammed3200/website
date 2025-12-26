"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import useLanguage from "@/hooks/uselanguage";
import { Button } from "@/components/ui/button";

export default function RegistrationCompletePage() {
    const { lang, isArabic } = useLanguage();

    return (
        <div className="w-full min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-green-100 p-4">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-din-bold text-gray-900 mb-4">
                    {isArabic ? "تم التسجيل بنجاح!" : "Registration Successful!"}
                </h1>

                <p className="text-gray-600 font-din-regular mb-8">
                    {isArabic
                        ? "شكراً لتسجيلك. سنقوم بمراجعة طلبك والتواصل معك قريباً."
                        : "Thank you for registering. We will review your application and contact you soon."}
                </p>

                <div className="space-y-3">
                    <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
                        <Link href={`/${lang}/innovators`}>
                            {isArabic ? "العودة إلى صفحة المبتكرين" : "Back to Innovators Page"}
                        </Link>
                    </Button>

                    <Button asChild variant="outline" className="w-full">
                        <Link href={`/${lang}`}>
                            {isArabic ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
