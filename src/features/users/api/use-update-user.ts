import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  (typeof client.api.users)[':id']['$patch'],
  200
>;
type RequestType = InferRequestType<(typeof client.api.users)[':id']['$patch']>;

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.users[':id'].$patch({
        param,
        json,
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });

  return mutation;
};
