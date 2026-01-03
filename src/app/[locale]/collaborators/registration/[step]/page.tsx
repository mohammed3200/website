console.log('[CollaboratorsPage] Module loaded');
import { notFound, redirect } from 'next/navigation';
import { CollaboratorFormWizard } from '@/features/collaborators/components/collaborator-form-wizard';
import { getCollaboratorFormConfig } from '@/features/collaborators/form-config';
import { routing } from '@/i18n/routing';

export const dynamicParams = true;

// Next.js 16 Page Props
type PageProps = {
    params: Promise<{
        locale: string;
        step: string;
    }>;
};

// Generate valid params for SSG
export async function generateStaticParams() {
    try {
        // Determine locales (mock if routing import fails, but assuming routing exists from context)
        const locales = routing?.locales || ['en', 'ar'];

        // Get step IDs from config (using a dummy t function as IDs usually don't depend on it, 
        // or we can just access the raw array if exported, but here we instantiate)
        const config = getCollaboratorFormConfig((k) => k);

        const params = [];
        for (const locale of locales) {
            for (const step of config.steps) {
                params.push({ locale, step: step.id });
            }
        }

        console.log('[CollaboratorsPage] Generated static params:', params);
        return params;
    } catch (error) {
        console.error('[CollaboratorsPage] Error generating static params:', error);
        return [];
    }
}

export default async function CollaboratorsRegistrationPage(props: PageProps) {
    const { locale, step } = await props.params;

    console.log(`[CollaboratorsPage] Processing request for step: "${step}" in locale: "${locale}"`);

    const config = getCollaboratorFormConfig((k) => k);
    const validIds = config.steps.map(s => s.id);

    console.log('[CollaboratorsPage] Configured Valid IDs:', validIds);
    console.log(`[CollaboratorsPage] Is step "${step}" valid?`, validIds.includes(step));

    // 1. Check if it's a valid ID
    if (validIds.includes(step)) {
        console.log('[CollaboratorsPage] Valid ID found. Rendering wizard.');
        return <CollaboratorFormWizard />;
    }

    // 2. Check if it's a legacy numeric ID
    const numericStep = parseInt(step, 10);
    console.log(`[CollaboratorsPage] Parsed numeric step: ${numericStep}`);

    if (!isNaN(numericStep) && numericStep > 0 && numericStep <= validIds.length) {
        // Redirect to new ID (numericStep is 1-indexed)
        const newId = validIds[numericStep - 1];
        const redirectUrl = `/${locale}/collaborators/registration/${newId}`;
        console.log(`[CollaboratorsPage] Legacy numeric ID detected. Redirecting to: ${redirectUrl}`);
        redirect(redirectUrl);
    }

    console.log('[CollaboratorsPage] Invalid step. Triggering notFound().');
    // 3. Otherwise 404
    notFound();
}
