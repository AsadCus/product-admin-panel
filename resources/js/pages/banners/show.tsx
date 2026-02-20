import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import BackButton from '@/components/back-button';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { useTranslation } from '@/translations';
import type { BreadcrumbItem } from '@/types';

interface Banner {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    supplier: { id: number; name: string };
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    banner: Banner;
}

export default function BannerShow({ banner }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('banners.title'), href: '/banners' },
        { title: t('common.detail'), href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={banner.title} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <BackButton />
                        <Heading title={banner.title} description={t('banners.details')} />
                    </div>
                    <Button asChild className="w-full sm:w-auto shrink-0">
                        <Link href="/banners/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('banners.add')}
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('banners.image')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img src={`/storage/${banner.image_path}`} alt={banner.title} className="w-full h-auto rounded-lg" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle>{t('banners.information')}</CardTitle>
                            <Button asChild size="sm" className="bg-black !text-white hover:bg-black/90">
                                <Link href={`/banners/${banner.id}/edit`}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    {t('banners.edit')}
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('banners.title_label')}</p>
                                <p className="text-lg font-semibold">{banner.title}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('common.description')}</p>
                                <p>{banner.description || t('banners.no_description')}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('suppliers.title')}</p>
                                <Badge variant="secondary">{banner.supplier.name}</Badge>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('banners.status')}</p>
                                <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                                    {banner.is_active ? t('banners.active') : t('banners.inactive')}
                                </Badge>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{t('banners.order_label')}</p>
                                <Badge variant="outline">#{banner.order}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
