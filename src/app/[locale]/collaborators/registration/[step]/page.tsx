console.log('[CollaboratorsPage] Module loaded');
import { notFound, redirect } from 'next/navigation';
import { CollaboratorFormWizard } from '@/features/collaborators/components/collaborator-form-wizard';
import { getCollaboratorFormConfig } from '@/features/collaborators/form-config';

export const dynamicParams = true;

// Next.js 16 Page Props
type PageProps = {
    params: Promise<{
        locale: string;
        step: string;
    }>;
};

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
