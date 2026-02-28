import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetFaqs = () => {
  return useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const response = await client.api.faqs.$get();
      if (!response.ok) {
        const error = (await response.json()) as any;
        throw new Error(error.message || 'Failed to fetch FAQs');
      }
      const { data } = await response.json();
      return data.map((faq: any) => ({
        ...faq,
        questionAr: faq.questionAr ?? undefined,
        answerAr: faq.answerAr ?? undefined,
        category: faq.category ?? undefined,
      }));
    },
  });
};
