import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
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
import { SortableDataTable } from '@/components/ui/sortable-data-table';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/translations';
import type { BreadcrumbItem } from '@/types';
import { useCategoryColumns, type Category } from './columns';

interface Props {
    categories: Category[];
}

export default function ProductCategoriesIndex({ categories }: Props) {
    const { t } = useTranslation();
    const columns = useCategoryColumns();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('categories.title'), href: '/product-categories' },
    ];

    const handleReorder = async (newData: Category[]) => {
        try {
            const categoriesWithOrder = newData.map((category, index) => ({
                id: category.id,
                order: index,
            }));

            await axios.post('/api/categories/reorder', {
                categories: categoriesWithOrder,
            });

            router.reload({ only: ['categories'] });
        } catch (error) {
            console.error('Failed to reorder categories:', error);
            alert('Gagal memperbarui urutan kategori');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('categories.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title={t('categories.title')}
                        description={t('categories.manage')}
                    />
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/product-categories/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('categories.add')}
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('categories.all')}</CardTitle>
                        <CardDescription>
                            {t('categories.list')} - Drag untuk mengubah urutan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SortableDataTable
                            columns={columns}
                            data={categories}
                            onReorder={handleReorder}
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
