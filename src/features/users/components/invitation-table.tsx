'use client';

import { format, isValid } from 'date-fns';
import { Trash2, CheckCircle, Mail } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { InvitationTableSkeleton } from '@/components/skeletons';
import type { InvitationWithRole } from '../types/user-type';

type Props = {
  invitations: InvitationWithRole[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  canRevoke?: boolean;
};

export const InvitationTable = ({
  invitations,
  isLoading,
  onDelete,
  isDeleting,
  canRevoke,
}: Props) => {
  if (isLoading) {
    return <InvitationTableSkeleton canRevoke={canRevoke} />;
  }

  if (invitations.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-center border rounded-md bg-white shadow-sm p-8">
        <div className="bg-gray-50 p-4 rounded-full mb-4">
          <Mail className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No active invitations
        </h3>
        <p className="text-sm text-gray-500 max-w-sm">
          There are currently no pending or active invitations. Click &quot;Invite User&quot; to send a new invitation.
        </p>
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
            {canRevoke && <TableHead className="text-right">Actions</TableHead>}
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
                  {inv.role.name.replace(/_/g, ' ').toUpperCase()}
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
                {inv.expiresAt && isValid(new Date(inv.expiresAt))
                  ? format(new Date(inv.expiresAt), 'MMM d, yyyy')
                  : 'N/A'}
              </TableCell>
              {canRevoke && (
                <TableCell className="text-right">
                  {inv.status === 'PENDING' && (
                    <button
                      onClick={() => onDelete(inv.id)}
                      disabled={isDeleting}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-md transition-colors disabled:opacity-50"
                      title="Revoke invitation"
                      aria-label={`Revoke invitation for ${inv.email}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
