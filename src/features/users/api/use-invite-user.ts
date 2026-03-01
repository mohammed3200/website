import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
  typeof client.api.users.invite.$post,
  201
>;
type RequestType = InferRequestType<typeof client.api.users.invite.$post>;

export const useInviteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.users.invite.$post({ json });

      if (!response.ok) {
        throw new Error('Failed to send invitation');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    onError: () => {
      toast.error('Failed to send invitation');
    },
  });

  return mutation;
};
