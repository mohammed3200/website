import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import type { NewsWithRelations } from "../types";

export const useGetNewsById = (id: string) => {
    return useQuery<NewsWithRelations, Error>({
        queryKey: ["news", id],
        queryFn: async () => {
            const response = await client.api.news[":id"].$get({
                param: { id }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch news");
            }

            const { data } = await response.json();
            return {
                ...data,
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
            } as NewsWithRelations;
        },
        enabled: !!id,
    });
};
