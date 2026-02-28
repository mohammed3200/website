import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export const useGetFaqs = () => {
  return useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const response = await client.api.faqs.$get();
      if (!response.ok) {
        let message = 'Failed to fetch FAQs';
        try {
          const error = await response.json();
          message = error.message || message;
        } catch (e) {
          // Fallback if not JSON
        }
        throw new Error(message);
      }
      const payload = await response.json();
      if (
        typeof payload !== 'object' ||
        payload === null ||
        !Array.isArray((payload as any).data)
      ) {
        throw new Error('Invalid response format: Expected data array');
      }
      return (payload as any).data.map((faq: any) => ({
        ...faq,
        questionAr: faq.questionAr ?? undefined,
        answerAr: faq.answerAr ?? undefined,
        category: faq.category ?? undefined,
      }));
    },
  });
};
