import { useTranslations } from "next-intl";
import useLanguage from "@/hooks/uselanguage";

import { Faqs } from "@/features/Faqs";

import { MockFaqData } from "@/mock";

export const Faq = () => {
  const t = useTranslations("Faq");
  const { isArabic } = useLanguage();

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="flex flex-col">
      <div className="container relative z-2 py-10">
        <div>
          <h3 className="font-din-bold h4 max-md:h5 max-w-640 max-w-md mb-7">
            {t("title")}
          </h3>
          <p className="font-din-regular body-1 max-lg:max-w-sm">
            {t("subtitle")}
          </p>
        </div>
      </div>
      <div className="relative flex-1">
        <Faqs listOfFaq={MockFaqData} />
      </div>
    </section>
  );
};
