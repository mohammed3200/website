'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useUpdateUser } from '../api/use-update-user';
import { useGetRoles } from '../api/use-get-roles';
import { updateUserSchema, type UpdateUserInput } from '../schemas/user-schema';
import { useEffect } from 'react';
import type { UserWithRole } from '../types/user-type';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithRole | null;
};

export const EditUserDialog = ({ isOpen, onClose, user }: Props) => {
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRoles();
  const roles = rolesData?.data ?? [];
  const { mutate: updateUser, isPending } = useUpdateUser();

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      roleId: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        roleId: user.role?.id || '',
        isActive: user.isActive,
      });
    }
  }, [isOpen, user, form]);

  const onSubmit = (values: UpdateUserInput) => {
    if (!user) return;

    updateUser(
      { param: { id: user.id }, json: values },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5 p-3 border rounded-md bg-gray-50">
                <span className="text-sm font-medium text-gray-500">User</span>
                <span className="text-sm font-semibold">
                  {user?.name || user?.email}
                </span>
                {user?.name && (
                  <span className="text-xs text-gray-500">{user.email}</span>
                )}
              </div>

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingRoles}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base text-gray-900">
                        Active Account
                      </FormLabel>
                      <div className="text-sm text-gray-500">
                        {field.value
                          ? 'This user can log in and access the system.'
                          : "This user's access has been deactivated."}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || isLoadingRoles}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
