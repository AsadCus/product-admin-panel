import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { BreadcrumbItem } from '@/types';
import { useTranslation } from '@/translations';

interface Supplier {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    supplier: Supplier;
    galleries_count?: number;
    created_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    products: {
        data: Product[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
}

export default function ProductsIndex({ products }: Props) {
    const { t } = useTranslation();
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/products/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('products.title'),
            href: '/products',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('products.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('products.title')}
                        description={t('products.manage')}
                    />
                    <Button asChild>
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
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('common.name')}</TableHead>
                                        <TableHead>{t('common.description')}</TableHead>
                                        <TableHead>{t('products.supplier')}</TableHead>
                                        <TableHead>{t('products.galleries')}</TableHead>
                                        <TableHead className="text-right">
                                            {t('common.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="text-center text-muted-foreground"
                                            >
                                                {t('products.no_products')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">
                                                    {product.name}
                                                </TableCell>
                                                <TableCell>
                                                    {product.description ? (
                                                        <span className="line-clamp-2">
                                                            {product.description}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {product.supplier.name}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {product.galleries_count || 0}{' '}
                                                        {t('products.images')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/products/${product.id}`}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/products/${product.id}/edit`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    product.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('dialog.delete_title')} {t('products.title')}</DialogTitle>
                        <DialogDescription>
                            {t('products.delete_confirm')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                        >
                            {t('dialog.cancel')}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            {t('dialog.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
