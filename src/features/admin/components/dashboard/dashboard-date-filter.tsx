'use client';

import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardDateFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const DashboardDateFilter = ({
  value,
  onChange,
}: DashboardDateFilterProps) => {
  const t = useTranslations('Admin.Dashboard.Filters');

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('selectRange')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LAST_7_DAYS">{t('last7Days')}</SelectItem>
          <SelectItem value="LAST_30_DAYS">{t('last30Days')}</SelectItem>
          <SelectItem value="THIS_MONTH">{t('thisMonth')}</SelectItem>
          <SelectItem value="LAST_MONTH">{t('lastMonth')}</SelectItem>
          <SelectItem value="THIS_YEAR">{t('thisYear')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
