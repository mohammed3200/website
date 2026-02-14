import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useLanguage from '@/hooks/use-language';

export const useAdminAuth = () => {
  const { data: session, status } = useSession();
  const { lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${lang}/auth/login`);
    } else if (status === 'authenticated') {
      const permissions = session?.user?.permissions as
        | Array<{ resource: string; action: string }>
        | undefined;

      const hasDashboardAccess = permissions?.some(
        (p) =>
          p.resource === 'dashboard' &&
          (p.action === 'read' || p.action === 'manage'),
      );

      if (!hasDashboardAccess) {
        router.push(`/${lang}`);
      }
    }
  }, [status, session, lang, router]);

  return { session, status };
};
