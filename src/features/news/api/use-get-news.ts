import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import type { NewsWithRelations } from "../types";

export const useGetNews = () => {
    return useQuery<NewsWithRelations[], Error>({
        queryKey: ["news"],
        queryFn: async () => {
            const response = await client.api.news.$get();

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
