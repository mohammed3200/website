import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export function InvitationTableSkeleton({ canRevoke = false }: { canRevoke?: boolean }) {
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
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell>
                                <Skeleton className="h-4 w-[200px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-5 w-[100px] rounded-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-5 w-[80px] rounded-full" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[150px]" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-[100px]" />
                            </TableCell>
                            {canRevoke && (
                                <TableCell className="text-right">
                                    <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
