'use client';

import { useState } from 'react';
import { useGetExperts } from '../api/use-get-experts';
import { useDeleteExpert } from '../api/use-delete-expert';
import { useUpdateExpert } from '../api/use-update-expert';
import { AcademicExpert } from '../types';
import { AdminExpertForm } from './admin-expert-form';


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/skeletons';
import { Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';

export const AdminExpertList = () => {

  const { data: experts, isLoading, isError } = useGetExperts();
  const deleteExpert = useDeleteExpert();
  const [editingExpert, setEditingExpert] = useState<AcademicExpert | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this expert?')) {
      deleteExpert.mutate(id);
    }
  };

  const handleEdit = (expert: AcademicExpert) => {
    setEditingExpert(expert);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setEditingExpert(null);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 py-8 text-center">
        Failed to load experts
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Academic Experts</h2>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Expert
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No data currently available. Click "Add Expert" to create one.
                </TableCell>
              </TableRow>
            ) : (
              experts?.map((expert: AcademicExpert) => (
                <TableRow key={expert.id}>
                  <TableCell className="font-medium">
                    {expert.fullName}
                  </TableCell>
                  <TableCell>{expert.title}</TableCell>
                  <TableCell>{expert.university}</TableCell>
                  <TableCell>{expert.order}</TableCell>
                  <TableCell>
                    {expert.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2 rtl:space-x-reverse">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(expert)}
                      aria-label={`Edit expert ${expert.fullName}`}
                    >
                      <Edit className="w-4 h-4 text-gray-500 hover:text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(expert.id)}
                      aria-label={`Delete expert ${expert.fullName}`}
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="ltr">
          <DialogHeader>
            <DialogTitle>
              {editingExpert ? 'Edit Expert' : 'Create Expert'}
            </DialogTitle>
          </DialogHeader>
          <AdminExpertForm
            initialData={editingExpert}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
