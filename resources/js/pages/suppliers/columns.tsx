import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"
import { useTranslation } from "@/translations"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"

export interface Supplier {
  id: number
  name: string
  desc: string | null
  products_count?: number
  created_at: string
  updated_at: string
}

export const useSupplierColumns = (): ColumnDef<Supplier>[] => {
  const { t } = useTranslation()
  const { confirmDelete, DeleteConfirmationDialog } = useDeleteConfirmation({
    title: t('common.confirm_delete'),
    description: t('suppliers.delete_warning'),
    successMessage: t('suppliers.deleted_success'),
    errorMessage: t('suppliers.deleted_error'),
  })

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('suppliers.name')} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[200px] truncate font-medium">
              {row.getValue("name")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "desc",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.description')} />
      ),
      cell: ({ row }) => {
        const description = row.getValue("desc") as string | null
        return (
          <div className="max-w-[300px] truncate">
            {description || (
              <span className="text-muted-foreground italic">
                {t('common.no_description')}
              </span>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "products_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('suppliers.products')} />
      ),
      cell: ({ row }) => {
        const count = row.getValue("products_count") as number || 0
        return (
          <Badge variant="outline">
            {count} {t('suppliers.products').toLowerCase()}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('common.created_at')} />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return (
          <div className="text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original

        return (
          <>
            <DataTableRowActions
              row={row}
              onView={(data) => router.visit(`/suppliers/${data.id}`)}
              onEdit={(data) => router.visit(`/suppliers/${data.id}/edit`)}
              onDelete={(data) => confirmDelete(`/suppliers/${data.id}`, data.name)}
              viewLabel={t('common.view')}
              editLabel={t('common.edit')}
              deleteLabel={t('common.delete')}
            />
            <DeleteConfirmationDialog />
          </>
        )
      },
    },
  ]
}