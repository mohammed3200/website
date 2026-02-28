'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useGetStatsTrends } from '@/features/admin/api/stats/use-get-stats-trends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface SubmissionTrendsChartProps {
  year?: number;
}

export const SubmissionTrendsChart = ({ year }: SubmissionTrendsChartProps) => {
  const { data, isLoading } = useGetStatsTrends(year);

  const chartData = (data?.trends ?? []).map((item) => ({
    ...item,
    name: getMonthNameEn(item.month),
  }));

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Submission Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 40,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="colorInnovators"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="colorCollaborators"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
              <Area
                type="monotone"
                dataKey="innovators"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorInnovators)"
                name="Innovators"
              />
              <Area
                type="monotone"
                dataKey="collaborators"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorCollaborators)"
                name="Collaborators"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

const getMonthNameEn = (month: string) => {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const parsedMonth = parseInt(month, 10);
  if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
    return '';
  }
  return months[parsedMonth - 1];
};
