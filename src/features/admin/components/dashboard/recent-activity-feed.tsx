'use client';

import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useGetActivity } from '@/features/admin/api/activity/use-get-activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export const RecentActivityFeed = () => {
  const { data, isLoading, isError } = useGetActivity(10);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full" />;
  }

  const activities = data?.activities || [];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          <div className="space-y-4">
            {isError ? (
              <p className="text-center text-sm text-red-500 py-8">
                Failed to load activity
              </p>
            ) : activities.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">
                No recent activity
              </p>
            ) : (
              activities.map((activity) => {
                const normalizedType = activity.type.toUpperCase();
                const date = new Date(activity.createdAt);
                const isValidDate = !isNaN(date.getTime());

                return (
                  <div
                    key={activity.id}
                    className="flex gap-4 items-start border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div
                      className={cn(
                        'p-2 rounded-full',
                        normalizedType.includes('ERROR')
                          ? 'bg-red-100 text-red-600'
                          : normalizedType.includes('NEW')
                            ? 'bg-blue-100 text-blue-600'
                            : normalizedType.includes('STATUS')
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600',
                      )}
                    >
                      <ActivityIcon type={activity.type} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {activity.message}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {isValidDate
                          ? formatDistanceToNow(date, {
                              addSuffix: true,
                              locale: enUS,
                            })
                          : '-'}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const ActivityIcon = ({ type }: { type: string }) => {
  const normalizedType = type.toUpperCase();

  if (normalizedType.includes('ERROR'))
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  if (normalizedType.includes('NEW'))
    return <Bell className="h-4 w-4 text-primary" />;
  if (normalizedType.includes('STATUS'))
    return <CheckCircle className="h-4 w-4 text-green-500" />;

  return <Info className="h-4 w-4 text-gray-500" />;
};
