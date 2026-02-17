'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.admin.reports[':id'].$delete({
        param: { id },
      });
      if (!res.ok) throw new Error('Failed to delete report');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
    },
  });
};
