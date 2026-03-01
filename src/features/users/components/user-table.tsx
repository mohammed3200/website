'use client';

import { format } from 'date-fns';
import { Edit2, ShieldAlert } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { UserWithRole } from '../types/user-type';

type Props = {
  users: UserWithRole[];
  isLoading: boolean;
  onEdit: (user: UserWithRole) => void;
};

export const UserTable = ({ users, isLoading, onEdit }: Props) => {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-500">
        Loading users...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-500 border rounded-md bg-white">
        No users found.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Login</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {user.name || 'Unnamed'}
                  </span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                </div>
              </TableCell>
              <TableCell>
                {user.role ? (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {user.role.name.replace('_', ' ').toUpperCase()}
                  </Badge>
                ) : (
                  <span className="text-gray-400 italic">No Role</span>
                )}
              </TableCell>
              <TableCell>
                {user.isActive ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {user.lastLoginAt
                  ? format(new Date(user.lastLoginAt), 'MMM d, yyyy HH:mm')
                  : 'Never'}
              </TableCell>
              <TableCell className="text-right">
                <button
                  onClick={() => onEdit(user)}
                  className="p-2 text-gray-400 hover:text-primary rounded-md transition-colors"
                  title="Edit user"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
