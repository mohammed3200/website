'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetAllStrategicPlans,
  usePostStrategicPlan,
  usePatchStrategicPlan,
  useDeleteStrategicPlan,
} from '@/features/strategic-plan/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { CreateStrategicPlanDialog } from '@/features/strategic-plan/components/create_strategic_plan_dialog';
import { EditStrategicPlanDialog } from '@/features/strategic-plan/components/edit_strategic_plan_dialog';
import { useTranslations } from 'next-intl';
import useLanguage from '@/hooks/use-language';

export default function StrategicPlansPage() {
  const router = useRouter();
  const t = useTranslations('Admin.StrategicPlans');
  const { lang, isArabic } = useLanguage();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const { data, isLoading, error } = useGetAllStrategicPlans();
  const deleteMutation = useDeleteStrategicPlan();

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setEditDialogOpen(true);
  };

  const handleDelete = (plan: any) => {
    setSelectedPlan(plan);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPlan) {
      deleteMutation.mutate(
        { id: selectedPlan.id },
        {
          onSuccess: () => {
            setDeleteDialogOpen(false);
            setSelectedPlan(null);
          },
        },
      );
    }
  };

  const handleView = (plan: any) => {
    router.push(`/${lang}/StrategicPlan/${plan.slug || plan.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">{t('status.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{t('status.error')}</p>
      </div>
    );
  }

  const plans = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('actions.create')}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.title')}</TableHead>
              <TableHead>{t('table.slug')}</TableHead>
              <TableHead>{t('table.category')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead>{t('table.priority')}</TableHead>
              <TableHead>{t('table.active')}</TableHead>
              <TableHead>{t('table.created')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  {t('empty')}
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan: any) => (
                <TableRow key={plan.id}>
                  <TableCell className="max-w-xs truncate font-medium">
                    {plan.title}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">
                    {plan.slug}
                  </TableCell>
                  <TableCell>
                    {plan.category ? (
                      <Badge variant="outline">{plan.category}</Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        plan.status === 'PUBLISHED'
                          ? 'default'
                          : plan.status === 'DRAFT'
                            ? 'secondary'
                            : plan.status === 'APPROVED'
                              ? 'default'
                              : 'outline'
                      }
                    >
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        plan.priority === 'HIGH' || plan.priority === 'CRITICAL'
                          ? 'destructive'
                          : plan.priority === 'MEDIUM'
                            ? 'default'
                            : 'secondary'
                      }
                    >
                      {plan.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(plan.createdAt).toLocaleDateString(
                      isArabic ? 'ar-EG' : 'en-US',
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(plan)}
                        title={t('actions.view')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                        title={t('actions.edit')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plan)}
                        className="text-red-600 hover:text-red-700"
                        title={t('actions.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <CreateStrategicPlanDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Edit Dialog */}
      {selectedPlan && (
        <EditStrategicPlanDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          plan={selectedPlan}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('dialogs.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('actions.cancel')}</AlertDialogCancel>{' '}
            {/* Assuming Cancel key. Using generic action for now if not present */}
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t('actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
