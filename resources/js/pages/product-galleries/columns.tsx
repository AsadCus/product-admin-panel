import { router } from "@inertiajs/react"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"
import { useDeleteConfirmation } from "@/hooks/use-delete-confirmation"
import { useTranslation } from "@/translations"

export interface Gallery {
  id: number
  file_path: string
  order: number
  product: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export const useGalleryColumns = (): ColumnDef<Gallery>[] => {
  const { t } = useTranslation()
  const { confirmDelete, DeleteConfirmationDialog } = useDeleteConfirmation({
    title: t('common.confirm_delete'),
    description: t('galleries.delete_warning'),
    successMessage: t('galleries.deleted_success'),
    errorMessage: t('galleries.deleted_error'),
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
      accessorKey: "file_path",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('galleries.image')} />
      ),
      cell: ({ row }) => {
        const filePath = row.getValue("file_path") as string
        return (
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
              <img 
                src={`/storage/${filePath}`} 
                alt="Gallery"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48"%3E%3Crect fill="%23ddd" width="48" height="48"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" font-size="10"%3EImg%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <span className="max-w-[200px] truncate font-mono text-sm">
              {filePath}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "product",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('galleries.product')} />
      ),
      cell: ({ row }) => {
        const product = row.getValue("product") as Gallery["product"]
        return (
          <Badge variant="secondary">
            {product.name}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        const product = row.getValue(id) as Gallery["product"]
        return product.name.toLowerCase().includes(value.toLowerCase())
      },
    },
    {
      accessorKey: "order",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('galleries.order')} />
      ),
      cell: ({ row }) => {
        const order = row.getValue("order") as number
        return (
          <Badge variant="outline">
            #{order}
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
        const gallery = row.original

        return (
          <>
            <DataTableRowActions
              row={row}
              onView={(data) => router.visit(`/product-galleries/${data.id}`)}
              onEdit={(data) => router.visit(`/product-galleries/${data.id}/edit`)}
              onDelete={(data) => confirmDelete(`/product-galleries/${data.id}`, `${data.product.name} - #${data.order}`)}
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