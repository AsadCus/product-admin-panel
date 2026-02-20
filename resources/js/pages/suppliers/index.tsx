import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/translations';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { useSupplierColumns, type Supplier } from './columns';

interface Props {
    suppliers: {
        data: Supplier[];
    };
}

export default function SuppliersIndex({ suppliers }: Props) {
    const { t } = useTranslation();
    const columns = useSupplierColumns();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('suppliers.title'), href: '/suppliers' },
    ];

    const handleBulkDelete = (selectedRows: Supplier[]) => {
        if (confirm(t('common.confirm_delete'))) {
            const ids = selectedRows.map(supplier => supplier.id);
            // For bulk delete, we'll need to implement a backend route
            // For now, delete them one by one
            ids.forEach(id => {
                router.delete(`/suppliers/${id}`, {
                    preserveScroll: true,
                    preserveState: true,
                });
            });
        }
    };

    const handleBulkAdd = (selectedRows: Supplier[]) => {
        console.log('Bulk add:', selectedRows);
        // You can implement bulk add functionality here
        // For example: add to favorites, export, etc.
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('suppliers.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title={t('suppliers.title')}
                        description={t('suppliers.manage')}
                    />
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/suppliers/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('suppliers.add')}
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('suppliers.all')}</CardTitle>
                        <CardDescription>
                            {t('suppliers.list')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={suppliers.data}
                            searchKey="name"
                            searchPlaceholder={t('suppliers.search_placeholder')}
                            onBulkDelete={handleBulkDelete}
                            onBulkAdd={handleBulkAdd}
                            bulkDeleteLabel={t('common.delete_selected')}
                            bulkAddLabel={t('common.add_selected')}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
