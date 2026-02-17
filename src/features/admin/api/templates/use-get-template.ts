'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetTemplate = (id?: string) => {
  return useQuery({
    queryKey: ['admin-template', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await client.api.admin.templates[':id'].$get({
        param: { id },
      });
      if (!res.ok) throw new Error('Failed to fetch template');
      const data = await res.json();
      return (data as any).template;
    },
    enabled: !!id,
  });
};
