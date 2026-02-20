import { Head, Link } from '@inertiajs/react';
import { Pencil, Package } from 'lucide-react';
import BackButton from '@/components/back-button';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/translations';
import type { BreadcrumbItem } from '@/types';

interface Product {
    id: number;
    name: string;
    description: string | null;
}

interface Supplier {
    id: number;
    name: string;
    desc: string | null;
    products: Product[];
    created_at: string;
    updated_at: string;
}

interface Props {
    supplier: Supplier;
}

export default function SupplierShow({ supplier }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('suppliers.title'), href: '/suppliers' },
        { title: t('common.detail'), href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={supplier.name} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <BackButton />
                        <Heading
                            title={supplier.name}
                            description={t('suppliers.details')}
                        />
                    </div>
                    <Button asChild className="w-full sm:w-auto shrink-0">
                        <Link href={`/suppliers/${supplier.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('suppliers.edit')}
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('suppliers.information')}</CardTitle>
                            <CardDescription>
                                {t('suppliers.basic_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('common.name')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {supplier.name}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('common.description')}
                                </p>
                                <p className="mt-1">
                                    {supplier.desc || (
                                        <span className="text-muted-foreground">
                                            {t('common.no_description')}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('suppliers.total_products')}
                                </p>
                                <Badge variant="secondary" className="mt-2">
                                    {supplier.products.length} {t('suppliers.products').toLowerCase()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('suppliers.products')}</CardTitle>
                            <CardDescription>
                                {t('suppliers.products_from')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {supplier.products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Package className="mb-2 h-12 w-12 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {t('suppliers.no_products_yet')}
                                    </p>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="mt-2"
                                        asChild
                                    >
                                        <Link href="/products/create">
                                            {t('products.add')}
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2 overflow-x-auto">
                                    {supplier.products.map((product) => (
                                        <div
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
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('common.metadata')}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('common.created_at')}
                            </p>
                            <p className="text-sm">
                                {new Date(supplier.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('common.updated_at')}
                            </p>
                            <p className="text-sm">
                                {new Date(supplier.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
