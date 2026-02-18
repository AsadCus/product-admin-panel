import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Package } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/translations';

interface Supplier {
    id: number;
    name: string;
    desc: string | null;
}

interface Gallery {
    id: number;
    file_path: string;
    order: number;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    supplier: Supplier;
    galleries: Gallery[];
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
}

export default function ProductShow({ product }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('products.title'), href: '/products' },
        { title: t('common.detail'), href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/products">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Heading
                            title={product.name}
                            description={t('products.details')}
                        />
                    </div>
                    <Button asChild>
                        <Link href={`/products/${product.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('products.edit')}
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('products.information')}</CardTitle>
                            <CardDescription>
                                {t('products.basic_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('common.name')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {product.name}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('common.description')}
                                </p>
                                <p className="mt-1">
                                    {product.description || (
                                        <span className="text-muted-foreground">
                                            {t('common.no_description')}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('products.supplier')}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {product.supplier.name}
                                    </Badge>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0"
                                        asChild
                                    >
                                        <Link
                                            href={`/suppliers/${product.supplier.id}`}
                                        >
                                            {t('suppliers.view_supplier')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('products.galleries')}</CardTitle>
                            <CardDescription>
                                {t('products.images_associated')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {product.galleries.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Package className="mb-2 h-12 w-12 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {t('products.no_galleries_yet')}
                                    </p>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="mt-2"
                                        asChild
                                    >
                                        <Link href="/product-galleries/create">
                                            {t('galleries.add')}
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2 overflow-x-auto">
                                    {product.galleries.map((gallery) => (
                                        <div
                                            key={gallery.id}
                                            className="flex items-center justify-between rounded-lg border p-3 min-w-max"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline">
                                                    #{gallery.order}
                                                </Badge>
                                                <p className="text-sm font-mono">
                                                    {gallery.file_path}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/product-galleries/${gallery.id}`}
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
                                {new Date(product.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('common.updated_at')}
                            </p>
                            <p className="text-sm">
                                {new Date(product.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
