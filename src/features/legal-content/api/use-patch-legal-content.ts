import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/lib/rpc';

type ResponseType = InferResponseType<
    (typeof client.api)['legal-content']['$patch'],
    200
>;
type RequestType = InferRequestType<
    (typeof client.api)['legal-content']['$patch']
>;

export const usePatchLegalContent = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ json }) => {
            const response = await client.api['legal-content'].$patch({
                json,
            });

            if (!response.ok) {
                throw new Error('Failed to update legal content');
            }

            return await response.json();
        },
        onSuccess: (_data, variables) => {
            toast.success('Legal content updated successfully');
            queryClient.invalidateQueries({
                queryKey: ['legal-content', variables.json.type, variables.json.locale],
            });
        },
        onError: () => {
            toast.error('Failed to update legal content');
        },
    });

    return mutation;
};
