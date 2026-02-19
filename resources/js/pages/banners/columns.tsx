import { ColumnDef } from '@tanstack/react-table';
import { router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { DataTableRowActions } from '@/components/ui/data-table-row-actions';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';

export interface Banner {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    supplier: { id: number; name: string };
    is_active: boolean;
    order: number;
}

export const useBannerColumns = (): ColumnDef<Banner>[] => {
    const { confirmDelete, DeleteConfirmationDialog } = useDeleteConfirmation({
        title: 'Delete Banner?',
        description: 'This will permanently delete the banner.',
        successMessage: 'Banner deleted successfully',
        errorMessage: 'Failed to delete banner',
    });

    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
            ),
        },
        {
            accessorKey: 'title',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        },
        {
            accessorKey: 'supplier',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Supplier" />,
            cell: ({ row }) => <Badge variant="secondary">{row.original.supplier.name}</Badge>,
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => (
                <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
                    {row.original.is_active ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            accessorKey: 'order',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Order" />,
            cell: ({ row }) => <Badge variant="outline">#{row.original.order}</Badge>,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <>
                    <DataTableRowActions
                        row={row}
                        onView={(data) => router.visit(`/banners/${data.id}`)}
                        onEdit={(data) => router.visit(`/banners/${data.id}/edit`)}
                        onDelete={(data) => confirmDelete(`/banners/${data.id}`, data.title)}
                        viewLabel="View"
                        editLabel="Edit"
                        deleteLabel="Delete"
                    />
                    <DeleteConfirmationDialog />
                </>
            ),
        },
    ];
};
