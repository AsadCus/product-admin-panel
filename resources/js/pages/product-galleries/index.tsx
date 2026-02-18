import { Head, Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
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
import { useTranslation } from '@/translations';

interface Product {
    id: number;
    name: string;
}

interface Gallery {
    id: number;
    file_path: string;
    order: number;
    product: Product;
    created_at: string;
}

interface Props {
    galleries: {
        data: Gallery[];
    };
}

export default function ProductGalleriesIndex({ galleries }: Props) {
    const { t } = useTranslation();
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('galleries.title'), href: '/product-galleries' },
    ];

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/product-galleries/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('galleries.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('galleries.title')}
                        description={t('galleries.manage')}
                    />
                    <Button asChild>
                        <Link href="/product-galleries/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('galleries.add')}
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('galleries.all')}</CardTitle>
                        <CardDescription>
                            {t('galleries.list')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('galleries.order')}</TableHead>
                                        <TableHead>{t('galleries.file_path')}</TableHead>
                                        <TableHead>{t('galleries.product')}</TableHead>
                                        <TableHead className="text-right">
                                            {t('common.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {galleries.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-muted-foreground"
                                            >
                                                {t('galleries.no_galleries')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        galleries.data.map((gallery) => (
                                            <TableRow key={gallery.id}>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        #{gallery.order}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {gallery.file_path}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="h-auto p-0"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/products/${gallery.product.id}`}
                                                        >
                                                            {gallery.product.name}
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/product-galleries/${gallery.id}`}
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
                                                                href={`/product-galleries/${gallery.id}/edit`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    gallery.id,
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
                        <DialogTitle>{t('dialog.delete_title')} {t('galleries.title')}</DialogTitle>
                        <DialogDescription>
                            {t('galleries.delete_confirm')}
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
