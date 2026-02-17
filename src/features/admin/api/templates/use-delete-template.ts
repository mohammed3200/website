'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await client.api.admin.templates[':id'].$delete({
        param: { id },
      });
      if (!res.ok) {
        const error = (await res.json()) as any;
        throw new Error(error.error || 'Failed to delete template');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success('Template deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
