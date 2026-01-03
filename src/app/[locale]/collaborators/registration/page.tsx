import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{
        locale: string;
    }>;
}

export default async function CollaboratorRegistrationPage({
    params,
}: PageProps) {
    // Directly redirect to the first step
    const { locale } = await params;
    redirect(`/${locale}/collaborators/registration/company-info`);
}