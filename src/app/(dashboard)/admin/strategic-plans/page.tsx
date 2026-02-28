'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGetAllStrategicPlans,
  useDeleteStrategicPlan,
} from '@/features/strategic-plan/api';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

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
import { useConfirm } from '@/hooks/use-confirm';

import { CreateStrategicPlanDialog } from '@/features/strategic-plan/components/create_strategic_plan_dialog';
import { EditStrategicPlanDialog } from '@/features/strategic-plan/components/edit_strategic_plan_dialog';

const StrategicPlansPage = () => {
  const router = useRouter();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const { data, isLoading, error } = useGetAllStrategicPlans();
  const deleteMutation = useDeleteStrategicPlan();

  const [DeleteDialog, confirmDelete] = useConfirm(
    'Delete Strategic Plan',
    'Are you sure you want to delete this strategic plan?',
    'destructive',
  );

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setEditDialogOpen(true);
  };

  const handleDelete = async (plan: any) => {
    const ok = await confirmDelete();
    if (ok) {
      deleteMutation.mutate(
        { id: plan.id },
        {
          onSuccess: () => {
            setSelectedPlan(null);
          },
        },
      );
    }
  };

  const handleView = (plan: any) => {
    router.push(`/StrategicPlan/${plan.slug || plan.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading plans</p>
      </div>
    );
  }

  const plans = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Strategic Plans</h1>
          <p className="text-gray-600 mt-1">
            Manage platform strategic plans and centers
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No strategic plans found
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
                    {new Date(plan.createdAt).toLocaleDateString('en-US')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(plan)}
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(plan)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete"
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
      <DeleteDialog />
    </div>
  );
};

export default StrategicPlansPage;
