import { notFound, redirect } from 'next/navigation';
import { InnovatorFormWizard } from '@/features/innovators/components/innovator-form-wizard';
import { getInnovatorFormConfig } from '@/features/innovators/form-config';
import { routing } from '@/i18n/routing';

export const dynamicParams = true;

type PageProps = {
    params: Promise<{
        locale: string;
        step: string;
    }>;
};

export async function generateStaticParams() {
    try {
        const locales = routing?.locales || ['en', 'ar'];
        const config = getInnovatorFormConfig((k) => k);

        const params = [];
        for (const locale of locales) {
            for (const step of config.steps) {
                params.push({ locale, step: step.id });
            }
        }

        console.log('[InnovatorsPage] Generated static params:', params);
        return params;
    } catch (error) {
        console.error('[InnovatorsPage] Error generating static params:', error);
        return [];
    }
}

export default async function InnovatorsRegistrationPage(props: PageProps) {
    const { locale, step } = await props.params;

    console.log(`[InnovatorsPage] Processing request for step: "${step}" in locale: "${locale}"`);

    const config = getInnovatorFormConfig((k) => k);
    const validIds = config.steps.map(s => s.id);

    console.log('[InnovatorsPage] Configured Valid IDs:', validIds);
    console.log(`[InnovatorsPage] Is step "${step}" valid?`, validIds.includes(step));

    if (validIds.includes(step)) {
        console.log('[InnovatorsPage] Valid ID found. Rendering wizard.');
        return <InnovatorFormWizard />;
    }

    const numericStep = parseInt(step, 10);
    console.log(`[InnovatorsPage] Parsed numeric step: ${numericStep}`);

    if (!isNaN(numericStep) && numericStep > 0 && numericStep <= validIds.length) {
        const newId = validIds[numericStep - 1];
        const redirectUrl = `/${locale}/innovators/registration/${newId}`;
        console.log(`[InnovatorsPage] Legacy numeric ID detected. Redirecting to: ${redirectUrl}`);
        redirect(redirectUrl);
    }

    console.log('[InnovatorsPage] Invalid step. Triggering notFound().');
    notFound();
}
