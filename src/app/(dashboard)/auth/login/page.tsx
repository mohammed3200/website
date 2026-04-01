import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/components/login-form';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const isGoogleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm isGoogleEnabled={isGoogleEnabled} />
    </Suspense>
  );
}
