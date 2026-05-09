import { ErrorCard } from "@/features/auth/components/error-card";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

const AuthErrorPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorCard />
        </Suspense>
    );
};

export default AuthErrorPage;
