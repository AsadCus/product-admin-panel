import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/translations';
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

interface Supplier {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    supplier: Supplier;
    products_count?: number;
    created_at: string;
}

interface Props {
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: '/product-categories' },
];

export default function ProductCategoriesIndex({ categories }: Props) {
    const { t } = useTranslation();
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbsTranslated: BreadcrumbItem[] = [
        { title: t('categories.title'), href: '/product-categories' },
    ];

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/product-categories/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbsTranslated}>
            <Head title={t('categories.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('categories.title')}
                        description={t('categories.manage')}
                    />
                    <Button asChild>
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
                            {t('categories.list')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('common.name')}</TableHead>
                                        <TableHead>{t('categories.supplier')}</TableHead>
                                        <TableHead>{t('categories.products')}</TableHead>
                                        <TableHead className="text-right">
                                            {t('common.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-muted-foreground"
                                            >
                                                {t('categories.no_categories')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        categories.map((category) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                {category.name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {category.supplier.name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {category.products_count || 0}{' '}
                                                    {t('categories.products').toLowerCase()}
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
                                                            href={`/product-categories/${category.id}`}
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
                                                            href={`/product-categories/${category.id}/edit`}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setDeleteId(
                                                                category.id,
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

            <Dialog
                open={deleteId !== null}
                onOpenChange={() => setDeleteId(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t('dialog.delete_title')} {t('categories.title')}</DialogTitle>
                        <DialogDescription>
                            {t('categories.delete_confirm')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                        >
                            {t('dialog.cancel')}
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            {t('dialog.delete')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
