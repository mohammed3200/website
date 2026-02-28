'use client';

import { useQuery } from '@tanstack/react-query';
import { client } from '@/lib/rpc';

export type Report = {
  id: string;
  name: string;
  type: string;
  format: string;
  status: 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export const useGetReports = () => {
  return useQuery<Report[]>({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const res = await client.api.admin.reports.$get();
      if (!res.ok) throw new Error('Failed to fetch reports');
      const data = await res.json();
      return (data as any).reports;
    },
  });
};
