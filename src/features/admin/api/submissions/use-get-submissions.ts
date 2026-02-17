'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { Innovator, Collaborator } from '@/features/admin/types';

export const useGetSubmissions = () => {
  return useQuery({
    queryKey: ['admin-submissions'],
    queryFn: async () => {
      const res = await client.api.admin.submissions.$get();
      if (!res.ok) throw new Error('Failed to fetch submissions');
      const data = await res.json();
      return data as unknown as {
        innovators: Innovator[];
        collaborators: Collaborator[];
      };
    },
  });
};
