import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/translations';

interface Supplier {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
}

interface Category {
    id: number;
    name: string;
    supplier: Supplier;
    products: Product[];
    created_at: string;
}

interface Props {
    category: Category;
}

export default function ProductCategoryShow({ category }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('categories.title'), href: '/product-categories' },
        { title: t('common.detail'), href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={category.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/product-categories">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={category.name}
                            description={t('categories.details')}
                        />
                    </div>
                    <Button asChild>
                        <Link href={`/product-categories/${category.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('categories.edit')}
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('categories.information')}</CardTitle>
                            <CardDescription>
                                {t('categories.basic_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('common.name')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {category.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('categories.supplier')}
                                </p>
                                <Badge variant="secondary" className="mt-1">
                                    {category.supplier.name}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('categories.total_products')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {category.products.length}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('categories.products_in_category')}</CardTitle>
                            <CardDescription>
                                {t('categories.products_list')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {category.products.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    {t('categories.no_products_yet')}
                                </p>
                            ) : (
                                <ul className="space-y-2 overflow-x-auto">
                                    {category.products.map((product) => (
                                        <li
                                            key={product.id}
                                            className="flex items-center justify-between rounded-lg border p-3 min-w-max"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {product.name}
                                                </p>
                                                {product.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                        {product.description}
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/products/${product.id}`}
                                                >
                                                    {t('common.view')}
                                                </Link>
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
