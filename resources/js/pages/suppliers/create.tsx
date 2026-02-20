import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/translations';
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
import InputError from '@/components/input-error';

export default function SupplierCreate() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        desc: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('suppliers.title'), href: '/suppliers' },
        { title: t('common.create'), href: '/suppliers/create' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/suppliers');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('suppliers.create')} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <Heading
                        title={t('suppliers.create')}
                        description={t('suppliers.create_desc')}
                    />
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>{t('suppliers.info')}</CardTitle>
                            <CardDescription>
                                {t('suppliers.fill_details')}
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
                                            ? t('suppliers.creating')
                                            : t('suppliers.create')}
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
