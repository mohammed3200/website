"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLanguage from "@/hooks/use-language";

export default function RegistrationPage() {
  const router = useRouter();
  const { lang } = useLanguage();

  useEffect(() => {
    // Redirect to multi-step form step 1
    router.replace(`/${lang}/innovators/registration/personal-info`);
  }, [router, lang]);

  return null;
}
