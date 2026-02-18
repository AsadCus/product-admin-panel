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
    desc: string | null;
    products_count?: number;
    created_at: string;
}

interface Props {
    suppliers: {
        data: Supplier[];
    };
}

export default function SuppliersIndex({ suppliers }: Props) {
    const { t } = useTranslation();
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('suppliers.title'), href: '/suppliers' },
    ];

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/suppliers/${deleteId}`, {
                onSuccess: () => setDeleteId(null),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('suppliers.title')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={t('suppliers.title')}
                        description={t('suppliers.manage')}
                    />
                    <Button asChild>
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
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('common.name')}</TableHead>
                                        <TableHead>{t('common.description')}</TableHead>
                                        <TableHead>{t('suppliers.products')}</TableHead>
                                        <TableHead className="text-right">
                                            {t('common.actions')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {suppliers.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-muted-foreground"
                                            >
                                                {t('suppliers.no_suppliers')}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        suppliers.data.map((supplier) => (
                                            <TableRow key={supplier.id}>
                                                <TableCell className="font-medium">
                                                    {supplier.name}
                                                </TableCell>
                                                <TableCell>
                                                    {supplier.desc ? (
                                                        <span className="line-clamp-2">
                                                            {supplier.desc}
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            -
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {supplier.products_count || 0}{' '}
                                                        {t('suppliers.products').toLowerCase()}
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
                                                                href={`/suppliers/${supplier.id}`}
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
                                                                href={`/suppliers/${supplier.id}/edit`}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeleteId(
                                                                    supplier.id,
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
                        <DialogTitle>{t('dialog.delete_title')} {t('suppliers.title')}</DialogTitle>
                        <DialogDescription>
                            {t('suppliers.delete_confirm')}
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
