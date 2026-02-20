import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/back-button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';
import { useTranslation } from '@/translations';

interface Supplier {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    supplier_id: number;
}

interface Props {
    product: Product;
    suppliers: Supplier[];
}

export default function ProductEdit({ product, suppliers }: Props) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: product.name,
        description: product.description || '',
        supplier_id: product.supplier_id.toString(),
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('products.title'), href: '/products' },
        { title: t('common.edit'), href: '' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/products/${product.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('common.edit')} ${product.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <Heading
                        title={`${t('common.edit')} ${product.name}`}
                        description={t('products.update')}
                    />
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>{t('products.info')}</CardTitle>
                            <CardDescription>
                                {t('products.update_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('products.name')}</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder={t('form.enter_name')}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">{t('common.description')}</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData('description', e.target.value)
                                        }
                                        placeholder={t('form.enter_description')}
                                        rows={4}
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="supplier">{t('products.supplier')}</Label>
                                    <Select
                                        value={data.supplier_id}
                                        onValueChange={(value) =>
                                            setData('supplier_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('form.select_supplier')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {suppliers.map((supplier) => (
                                                <SelectItem
                                                    key={supplier.id}
                                                    value={supplier.id.toString()}
                                                >
                                                    {supplier.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.supplier_id} />
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? t('products.updating') : t('common.update')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href="/products">{t('common.cancel')}</Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
