import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';
import type { LegalContentType, LegalContentLocale } from '../types/legal-content-type';

export const useGetLegalContent = (
    type: LegalContentType,
    locale: LegalContentLocale,
    options?: { enabled?: boolean },
) => {
    const query = useQuery({
        queryKey: ['legal-content', type, locale],
        queryFn: async () => {
            const response = await client.api['legal-content'].$get({
                query: { type, locale },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch legal content');
            }

            const { data } = await response.json();
            return data;
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
        ...options,
    });

    return query;
};
