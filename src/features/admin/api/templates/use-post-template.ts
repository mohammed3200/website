'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { InferRequestType } from 'hono';

type CreateTemplateRequest = InferRequestType<
  typeof client.api.admin.templates.$post
>['json'];

export const usePostTemplate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const locale = useLocale();

  return useMutation({
    mutationFn: async (json: CreateTemplateRequest) => {
      const res = await client.api.admin.templates.$post({ json });
      if (!res.ok) {
        const error = (await res.json()) as any;
        throw new Error(error.error || 'Failed to create template');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast.success('Template created');
      queryClient.invalidateQueries({ queryKey: ['admin-templates'] });
      router.push(`/${locale}/admin/templates`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
