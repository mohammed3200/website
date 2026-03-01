'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, UserPlus, CheckCircle, Mail } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { InvitationWithRole } from '../types/user-type';

type Props = {
  invitations: InvitationWithRole[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
};

export const InvitationTable = ({
  invitations,
  isLoading,
  onDelete,
  isDeleting,
}: Props) => {
  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-500">
        Loading invitations...
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="w-full h-48 flex items-center justify-center text-gray-500 border rounded-md bg-white">
        No active invitations found.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invited By</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium text-gray-900">
                {inv.email}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {inv.role.name.replace('_', ' ').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {inv.status === 'PENDING' && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    <Mail className="h-3 w-3 mr-1" /> Pending
                  </Badge>
                )}
                {inv.status === 'ACCEPTED' && (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    <CheckCircle className="h-3 w-3 mr-1" /> Accepted
                  </Badge>
                )}
                {inv.status === 'EXPIRED' && (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    Expired
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {inv.inviter.name || inv.inviter.email}
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {format(new Date(inv.expiresAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                {inv.status === 'PENDING' && (
                  <button
                    onClick={() => onDelete(inv.id)}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-md transition-colors disabled:opacity-50"
                    title="Revoke invitation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
