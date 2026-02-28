'use client';

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
  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LAST_7_DAYS">Last 7 Days</SelectItem>
          <SelectItem value="LAST_30_DAYS">Last 30 Days</SelectItem>
          <SelectItem value="THIS_MONTH">This Month</SelectItem>
          <SelectItem value="LAST_MONTH">Last Month</SelectItem>
          <SelectItem value="THIS_YEAR">This Year</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
