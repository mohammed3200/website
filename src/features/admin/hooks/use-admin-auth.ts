import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { RESOURCES, ACTIONS, checkPermission } from '@/lib/rbac-base';

export const useAdminAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login`);
    } else if (status === 'authenticated') {
      const permissions = session?.user?.permissions as any;

      const hasDashboardAccess = checkPermission(
        permissions,
        RESOURCES.DASHBOARD,
        ACTIONS.READ,
      );

      if (!hasDashboardAccess) {
        router.push(`/`);
      }
    }
  }, [status, session, router]);

  return { session, status };
};
