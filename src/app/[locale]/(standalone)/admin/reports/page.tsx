'use client';

import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';
import {
  FileText,
  Download,
  Trash2,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  useGetReports,
  useGenerateReport,
  useDeleteReport,
} from '@/features/admin/api/use-reports';
import { cn } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ReportsPage = () => {
  const t = useTranslations('Admin.Reports');
  const { isArabic, lang } = useLanguage();

  const {
    data: reports = [],
    isLoading,
    refetch,
    isFetching,
  } = useGetReports();
  const generateMutation = useGenerateReport();
  const deleteMutation = useDeleteReport();

  const handleGenerateReport = async (type: string, name: string) => {
    try {
      await generateMutation.mutateAsync({
        name,
        type,
        format: 'CSV',
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const handleDeleteReport = async (id: string) => {
    if (!confirm(t('dialogs.confirmDelete'))) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3" />
            {t('status.completed')}
          </span>
        );
      case 'GENERATING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <RefreshCw className="h-3 w-3 animate-spin" />
            {t('status.generating')}
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="h-3 w-3" />
            {t('status.pending')}
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3" />
            {t('status.failed')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-outfit">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{t('subtitle')}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() =>
              handleGenerateReport(
                'SUBMISSIONS_SUMMARY',
                `${t('types.SUBMISSIONS_SUMMARY')} - ${new Date().toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}`,
              )
            }
            disabled={generateMutation.isPending}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-600 rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {generateMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {t('actions.generateSummary')}
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
            title={t('status.loading')}
          >
            <RefreshCw
              className={cn('h-4 w-4', isFetching && 'animate-spin')}
            />
          </button>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6">{t('table.name')}</TableHead>
              <TableHead className="px-6">{t('table.type')}</TableHead>
              <TableHead className="px-6">{t('table.status')}</TableHead>
              <TableHead className="px-6">{t('table.createdAt')}</TableHead>
              <TableHead className="px-6 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  {t('status.loading')}
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report: any) => (
                <TableRow key={report.id}>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {report.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                      {t(`types.${report.type}`)} / {report.format}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(report.createdAt), 'PPP p', {
                      locale: isArabic ? ar : enUS,
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 rtl:space-x-reverse">
                    {report.status === 'COMPLETED' &&
                      (report.fileUrl ? (
                        <a
                          href={report.fileUrl}
                          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title={t('actions.download')}
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      ) : (
                        <span
                          className="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-50 rounded-md cursor-not-allowed"
                          title={t('status.failed')}
                          aria-disabled="true"
                        >
                          <Download className="h-4 w-4" />
                        </span>
                      ))}
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      disabled={deleteMutation.isPending}
                      className="inline-flex items-center justify-center p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title={t('actions.delete')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ReportsPage;
