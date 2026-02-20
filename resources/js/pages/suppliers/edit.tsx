import { Head, Link, useForm } from '@inertiajs/react';
import BackButton from '@/components/back-button';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/translations';
import type { BreadcrumbItem } from '@/types';

interface Supplier {
    id: number;
    name: string;
    desc: string | null;
}

interface Props {
    supplier: Supplier;
}

export default function SupplierEdit({ supplier }: Props) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name,
        desc: supplier.desc || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('suppliers.title'), href: '/suppliers' },
        { title: t('common.edit'), href: '' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/suppliers/${supplier.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('suppliers.edit')} ${supplier.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <Heading
                        title={`${t('suppliers.edit')} ${supplier.name}`}
                        description={t('suppliers.update')}
                    />
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>{t('suppliers.info')}</CardTitle>
                            <CardDescription>
                                {t('suppliers.update_details')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('suppliers.name')}</Label>
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
                                    <Label htmlFor="desc">{t('common.description')}</Label>
                                    <Textarea
                                        id="desc"
                                        value={data.desc}
                                        onChange={(e) =>
                                            setData('desc', e.target.value)
                                        }
                                        placeholder={t('form.enter_description')}
                                        rows={4}
                                    />
                                    <InputError message={errors.desc} />
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing
                                            ? t('suppliers.updating')
                                            : t('common.update')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href="/suppliers">{t('common.cancel')}</Link>
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
