'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetTemplates = () => {
  return useQuery({
    queryKey: ['admin-templates'],
    queryFn: async () => {
      const res = await client.api.admin.templates.$get();
      if (!res.ok) throw new Error('Failed to fetch templates');
      const data = await res.json();
      return (data as any).templates;
    },
  });
};
