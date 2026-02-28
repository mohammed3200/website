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
      return reports.map((report: Record<string, unknown>, index: number) => {
        // Assert non-null object
        if (!report || typeof report !== 'object') {
          throw new Error(`Invalid report at index ${index}: Expected object`);
        }

        // Strict field validation
        const requiredStrings = ['id', 'name', 'type', 'format'];
        for (const field of requiredStrings) {
          if (typeof report[field] !== 'string') {
            throw new Error(
              `Invalid report at index ${index}: ${field} must be a string`,
            );
          }
        }

        // Date validation and normalization
        const createdAtParsed = Date.parse(report.createdAt);
        if (isNaN(createdAtParsed)) {
          throw new Error(`Invalid createdAt date for report ${report.id}`);
        }
        const updatedAtParsed = Date.parse(report.updatedAt);
        if (isNaN(updatedAtParsed)) {
          throw new Error(`Invalid updatedAt date for report ${report.id}`);
        }

        // Validate optional fileUrl
        const fileUrl =
          typeof report.fileUrl === 'string' ? report.fileUrl : undefined;

        // Compute validated status
        const status = [
          'PENDING',
          'GENERATING',
          'COMPLETED',
          'FAILED',
        ].includes(report.status)
          ? (report.status as Report['status'])
          : 'FAILED';

        // Construct new object with only validated fields
        return {
          id: report.id,
          name: report.name,
          type: report.type,
          format: report.format,
          status,
          fileUrl,
          createdAt: new Date(createdAtParsed).toISOString(),
          updatedAt: new Date(updatedAtParsed).toISOString(),
        };
      });
    },
  });
};
