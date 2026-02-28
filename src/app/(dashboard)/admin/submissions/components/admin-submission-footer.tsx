import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isValidDate } from '@/lib/utils';

interface AdminSubmissionFooterProps {
  createdAt: string | Date;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
  isLoading: boolean;
  submitterName: string;
  entityTypeLabel: string; // e.g., 'innovator' or 'collaborator'
}

export const AdminSubmissionFooter = ({
  createdAt,
  onApprove,
  onReject,
  onDelete,
  isLoading,
  submitterName,
  entityTypeLabel,
}: AdminSubmissionFooterProps) => {
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t">
      <div>
        <p className="text-xs text-gray-500">
          Submitted on{' '}
          {isValidDate(createdAt) ? format(new Date(createdAt), 'PPP p') : '—'}
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 border-green-200 hover:bg-green-50"
          onClick={onApprove}
          disabled={isLoading}
        >
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={onReject}
          disabled={isLoading}
        >
          Reject
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onDelete}
          disabled={isLoading}
          className="h-9 w-9 text-gray-400 hover:text-red-600"
          aria-label={`Delete ${entityTypeLabel} submission from ${submitterName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
