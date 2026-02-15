import { useQuery } from "@tanstack/react-query";
import { Innovator } from "../types/types";

import { client } from "@/lib/rpc";

export const useGetPublicInnovators = () => {
    const query = useQuery<Innovator[], Error>({
        queryKey: ["innovators", "public"],
        queryFn: async () => {
            const response = await client.api.innovators.public['$get']();

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to fetch innovators");
            }

            const { data } = await response.json();

            return data as Innovator[];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    });

    return query;
};
