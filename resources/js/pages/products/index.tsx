import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/translations';
import type { BreadcrumbItem } from '@/types';
import { useProductColumns, type Product } from './columns';

interface Props {
    products: {
        data: Product[];
    };
}

export default function ProductsIndex({ products }: Props) {
    const { t } = useTranslation();
    const columns = useProductColumns();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('products.title'),
            href: '/products',
        },
    ];

    const handleBulkDelete = (selectedProducts: Product[]) => {
        if (confirm(`${t('common.confirm_delete')} ${selectedProducts.length} ${t('products.title').toLowerCase()}?`)) {
            const ids = selectedProducts.map(product => product.id);
            // You can implement bulk delete API call here
            router.post('/products/bulk-delete', { ids }, {
                onSuccess: () => {
                    // Refresh the page or update the data
                    router.reload();
                }
            });
        }
    };

    const handleBulkAdd = (selectedProducts: Product[]) => {
        // Example: Add to favorites, categories, etc.
        console.log('Bulk add:', selectedProducts);
        // You can implement bulk add functionality here
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('products.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title={t('products.title')}
                        description={t('products.manage')}
                    />
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('products.add')}
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('products.all')}</CardTitle>
                        <CardDescription>
                            {t('products.list')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            columns={columns}
                            data={products.data}
                            searchKey="name"
                            searchPlaceholder={t('products.search_placeholder')}
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
