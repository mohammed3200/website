'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { InferRequestType } from 'hono';

type UpdateTemplateRequest = InferRequestType<
  (typeof client.api.admin.templates)[':id']['$patch']
>['json'];

export const usePatchTemplate = (id: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (json: UpdateTemplateRequest) => {
      const res = await client.api.admin.templates[':id'].$patch({
        param: { id },
        json,
      });
      if (!res.ok) {
        const error = (await res.json()) as any;
        throw new Error(error.error || 'Failed to update template');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success('Template updated');
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
      queryClient.invalidateQueries({ queryKey: ['admin-template', id] });
      router.push('/admin/templates');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
