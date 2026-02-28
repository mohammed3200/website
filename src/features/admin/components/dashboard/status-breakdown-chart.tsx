'use client';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useGetStatsBreakdown } from '@/features/admin/api/stats/use-get-stats-breakdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const StatusBreakdownChart = () => {
  const { data, isLoading } = useGetStatsBreakdown();

  const chartData = [
    {
      name: 'Pending',
      value:
        (data?.innovators.pending || 0) + (data?.collaborators.pending || 0),
      color: '#f59e0b',
    },
    {
      name: 'Approved',
      value:
        (data?.innovators.approved || 0) + (data?.collaborators.approved || 0),
      color: '#10b981',
    },
    {
      name: 'Rejected',
      value:
        (data?.innovators.rejected || 0) + (data?.collaborators.rejected || 0),
      color: '#ef4444',
    },
  ];

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Status Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
