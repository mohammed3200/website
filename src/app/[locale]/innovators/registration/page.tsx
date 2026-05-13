import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: 'Meta' });
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/innovators/registration`;

  return {
    title: tMeta('innovators.title'),
    description: tMeta('innovators.description'),
    alternates: {
      canonical: url,
      languages: {
        ar: `${process.env.NEXT_PUBLIC_SITE_URL}/ar/innovators/registration`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/innovators/registration`,
        'x-default': url,
      },
    },
    openGraph: {
      title: tMeta('innovators.title'),
      description: tMeta('innovators.description'),
      url,
      locale: locale === 'ar' ? 'ar_LY' : 'en_US',
    },
  };
}

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Redirect to multi-step form step 1
  redirect(`/${locale}/innovators/registration/personal-info`);
}
