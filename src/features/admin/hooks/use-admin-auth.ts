import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import useLanguage from '@/hooks/use-language';

import { RESOURCES, ACTIONS, checkPermission } from '@/lib/rbac-base';

export const useAdminAuth = () => {
  const { data: session, status } = useSession();
  const { lang } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${lang}/auth/login`);
    } else if (status === 'authenticated') {
      const permissions = session?.user?.permissions as any;

      const hasDashboardAccess = checkPermission(
        permissions,
        RESOURCES.DASHBOARD,
        ACTIONS.READ,
      );

      if (!hasDashboardAccess) {
        router.push(`/${lang}`);
      }
    }
  }, [status, session, lang, router]);

  return { session, status };
};
