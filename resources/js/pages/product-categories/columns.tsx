import { router } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"
import { useTranslation } from "@/translations"

export interface Category {
  id: number
  name: string
  supplier: {
    id: number
    name: string
  }
  products_count?: number
  order?: number
  created_at: string
  updated_at: string
}

export const useCategoryColumns = (): ColumnDef<Category>[] => {
  const { t } = useTranslation()
  const { confirmDelete, DeleteConfirmationDialog } = useDeleteConfirmation({
    title: t('common.confirm_delete'),
    description: t('categories.delete_warning'),
    successMessage: t('categories.deleted_success'),
    errorMessage: t('categories.deleted_error'),
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
        <DataTableColumnHeader column={column} title={t('categories.name')} />
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
      accessorKey: "supplier",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('categories.supplier')} />
      ),
      cell: ({ row }) => {
        const supplier = row.getValue("supplier") as Category["supplier"]
        return (
          <Badge variant="secondary">
            {supplier.name}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        const supplier = row.getValue(id) as Category["supplier"]
        return supplier.name.toLowerCase().includes(value.toLowerCase())
      },
    },
    {
      accessorKey: "products_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('categories.products')} />
      ),
      cell: ({ row }) => {
        const count = row.getValue("products_count") as number || 0
        return (
          <Badge variant="outline">
            {count} {t('categories.products').toLowerCase()}
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
        return (
          <>
            <DataTableRowActions
              row={row}
              onView={(data) => router.visit(`/product-categories/${data.id}`)}
              onEdit={(data) => router.visit(`/product-categories/${data.id}/edit`)}
              onDelete={(data) => confirmDelete(`/product-categories/${data.id}`, data.name)}
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