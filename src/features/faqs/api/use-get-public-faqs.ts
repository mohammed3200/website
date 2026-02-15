import { useQuery } from "@tanstack/react-query";
import { Faq } from "../types";

import { client } from "@/lib/rpc";

export const useGetPublicFaqs = () => {
    const query = useQuery<Faq[], Error>({
        queryKey: ["faqs", "public"],
        queryFn: async () => {
            const response = await client.api.faqs.public['$get']();

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch FAQs");
            }

            const { data } = await response.json();

            return data as Faq[];
        },
        staleTime: 10 * 60 * 1000, // 10 minutes (FAQs change infrequently)
        retry: 2,
    });

    return query;
};
