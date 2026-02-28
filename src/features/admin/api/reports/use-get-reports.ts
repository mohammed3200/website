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
      const reports = (data as any).reports;
      if (!Array.isArray(reports)) {
        throw new Error('Invalid reports format: Expected array');
      }
      return reports.map((item: unknown, index: number) => {
        // Assert non-null object
        if (!item || typeof item !== 'object') {
          throw new Error(`Invalid report at index ${index}: Expected object`);
        }

        const report = item as Record<string, unknown>;

        // Strict field extraction with defaults/validation
        const id = typeof report.id === 'string' ? report.id : '';
        const name = typeof report.name === 'string' ? report.name : '';
        const type = typeof report.type === 'string' ? report.type : '';
        const format = typeof report.format === 'string' ? report.format : '';
        const rawStatus =
          typeof report.status === 'string' ? report.status : '';
        const rawCreatedAt =
          typeof report.createdAt === 'string' ? report.createdAt : '';
        const rawUpdatedAt =
          typeof report.updatedAt === 'string' ? report.updatedAt : '';

        if (
          !id ||
          !name ||
          !type ||
          !format ||
          !rawStatus ||
          !rawCreatedAt ||
          !rawUpdatedAt
        ) {
          throw new Error(
            `Invalid report at index ${index}: Missing required string fields`,
          );
        }

        // Date validation and normalization
        const createdAtParsed = Date.parse(rawCreatedAt);
        if (isNaN(createdAtParsed)) {
          throw new Error(`Invalid createdAt date for report ${id}`);
        }
        const updatedAtParsed = Date.parse(rawUpdatedAt);
        if (isNaN(updatedAtParsed)) {
          throw new Error(`Invalid updatedAt date for report ${id}`);
        }

        // Validate optional fileUrl
        const fileUrl =
          typeof report.fileUrl === 'string' ? report.fileUrl : undefined;

        // Compute validated status
        const VALID_STATUSES = ['PENDING', 'GENERATING', 'COMPLETED', 'FAILED'];

        const status = VALID_STATUSES.includes(rawStatus)
          ? (rawStatus as Report['status'])
          : 'FAILED';

        // Construct new object with only validated fields
        return {
          id,
          name,
          type,
          format,
          status,
          fileUrl,
          createdAt: new Date(createdAtParsed).toISOString(),
          updatedAt: new Date(updatedAtParsed).toISOString(),
        } satisfies Report;
      });
    },
  });
};
