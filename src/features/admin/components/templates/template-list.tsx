'use client';

import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useGetTemplates } from '@/features/admin/api/templates/use-get-templates';
import { useDeleteTemplate } from '@/features/admin/api/templates/use-delete-template';
import { useConfirm } from '@/hooks/use-confirm';

import { formatDate } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useTranslations } from 'next-intl';

export const TemplateList = () => {
  const t = useTranslations('Admin.Templates');
  const router = useRouter();
  const { data: templates, isLoading } = useGetTemplates();
  const deleteMutation = useDeleteTemplate();
  const [DeleteDialog, confirmDelete] = useConfirm(
    t('deleteTitle', { default: 'Delete Template' }),
    t('deleteMessage', {
      default:
        'Are you sure you want to delete this template? This action cannot be undone.',
    }),
    'destructive',
  );

  const handleDelete = async (id: string) => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return <TemplateListSkeleton />;
  }

  const list = templates || [];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Message Templates</CardTitle>
          <Button onClick={() => router.push('/admin/templates/new')}>
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name (En)</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No templates found.
                  </TableCell>
                </TableRow>
              ) : (
                list.map((template: any) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      {template.nameEn}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {template.slug}
                    </TableCell>
                    <TableCell>
                      <ChannelBadge channel={template.channel} />
                    </TableCell>
                    <TableCell>
                      {template.isActive ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Active
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-600"
                        >
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(template.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/templates/${template.id}`)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!template.isSystem && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <DeleteDialog />
    </>
  );
};

const ChannelBadge = ({ channel }: { channel: string }) => {
  switch (channel) {
    case 'EMAIL':
      return <Badge variant="secondary">Email</Badge>;
    case 'WHATSAPP':
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          WhatsApp
        </Badge>
      );
    case 'BOTH':
      return <Badge variant="default">Both</Badge>;
    default:
      return <Badge>{channel}</Badge>;
  }
};

const TemplateListSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-48" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </CardContent>
  </Card>
);
