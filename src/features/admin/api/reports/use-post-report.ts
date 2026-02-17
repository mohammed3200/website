'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const usePostReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (json: {
      name: string;
      type:
        | 'SUBMISSIONS_SUMMARY'
        | 'USER_ACTIVITY'
        | 'STRATEGIC_PLANS'
        | 'FULL_PLATFORM';
      format: 'PDF' | 'CSV';
    }) => {
      const res = await client.api.admin.reports.$post({ json });
      if (!res.ok) throw new Error('Failed to generate report');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });
};
