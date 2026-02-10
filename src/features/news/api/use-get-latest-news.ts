import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import type { NewsWithRelations } from "../types";

export const useGetLatestNews = (limit: number = 6) => {
    return useQuery<NewsWithRelations[], Error>({
        queryKey: ["news", "latest", limit],
        queryFn: async () => {
            const response = await client.api.news.latest.$get({
                query: { limit: limit.toString() }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch news");
            }

            const { data } = await response.json();
            return data.map((item: any) => ({
                ...item,
                createdAt: new Date(item.createdAt),
                updatedAt: new Date(item.updatedAt),
                publishedAt: item.publishedAt ? new Date(item.publishedAt) : null,
            })) as NewsWithRelations[];
        },
    });
};
