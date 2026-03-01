'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/features/admin/hooks/use-admin-auth';
import { checkPermission, RESOURCES, ACTIONS } from '@/lib/rbac-base';
import {
  useGetUsers,
  useGetInvitations,
  useDeleteInvitation,
  UserTable,
  InvitationTable,
  InviteUserDialog,
  EditUserDialog,
  type UserWithRole,
} from '@/features/users';
import { Users, Mail, UserPlus } from 'lucide-react';

const UsersManagementPage = () => {
  const router = useRouter();
  const { session, status } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(25);

  const hasUsersAccess = useMemo(() => {
    return checkPermission(
      session?.user?.permissions as any,
      RESOURCES.USERS,
      ACTIONS.READ,
    );
  }, [session]);

  const hasManageAccess = useMemo(() => {
    return checkPermission(
      session?.user?.permissions as any,
      RESOURCES.USERS,
      ACTIONS.MANAGE,
    );
  }, [session]);

  const hasInvitationsAccess = useMemo(() => {
    return checkPermission(
      session?.user?.permissions as any,
      RESOURCES.INVITATIONS,
      ACTIONS.READ,
    );
  }, [session]);

  const hasInviteAccess = useMemo(() => {
    return checkPermission(
      session?.user?.permissions as any,
      RESOURCES.INVITATIONS,
      ACTIONS.CREATE,
    );
  }, [session]);

  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers(
    page,
    limit,
    undefined,
    undefined,
    undefined,
  );
  const { data: invitationsData, isLoading: isLoadingInvitations } =
    useGetInvitations();
  const { mutate: deleteInvitation, isPending: isDeleting } =
    useDeleteInvitation();

  if (status === 'authenticated' && !hasUsersAccess) {
    router.push('/');
    return null;
  }

  // Handle Edit User
  const handleEditUser = (user: UserWithRole) => {
    if (!hasManageAccess) return;
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteInvitation = (id: string) => {
    if (window.confirm('Are you sure you want to revoke this invitation?')) {
      deleteInvitation({ param: { id } });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage user accounts, roles, and invitations.
          </p>
        </div>

        {hasInviteAccess && (
          <button
            onClick={() => setIsInviteOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Invite User
          </button>
        )}
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <Users className="h-4 w-4" />
            Users
            {usersData && (
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {usersData.metadata.total}
              </span>
            )}
          </button>

          {hasInvitationsAccess && (
            <button
              onClick={() => setActiveTab('invitations')}
              className={`whitespace-nowrap flex items-center gap-2 border-b-2 py-4 px-1 text-sm font-medium ${
                activeTab === 'invitations'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <Mail className="h-4 w-4" />
              Invitations
              {invitationsData && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {
                    invitationsData.data.filter((i) => i.status === 'PENDING')
                      .length
                  }{' '}
                  Pending
                </span>
              )}
            </button>
          )}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'users' && (
          <UserTable
            users={(usersData?.data as any) || []}
            isLoading={isLoadingUsers}
            onEdit={handleEditUser}
          />
        )}

        {activeTab === 'invitations' && hasInvitationsAccess && (
          <InvitationTable
            invitations={(invitationsData?.data as any) || []}
            isLoading={isLoadingInvitations}
            onDelete={handleDeleteInvitation}
            isDeleting={isDeleting}
          />
        )}
      </div>

      <InviteUserDialog
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <EditUserDialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setTimeout(() => setSelectedUser(null), 300);
        }}
        user={selectedUser}
      />
    </div>
  );
};

export default UsersManagementPage;
