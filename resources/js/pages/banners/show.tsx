import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
    return (
        <AppLayout breadcrumbs={[{ title: 'Banners', href: '/banners' }, { title: 'Detail', href: '' }]}>
            <Head title={banner.title} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <BackButton />
                        <Heading title={banner.title} description="Banner details" />
                    </div>
                    <Button asChild className="w-full sm:w-auto shrink-0">
                        <Link href={`/banners/${banner.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Banner Image</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img src={`/storage/${banner.image_path}`} alt={banner.title} className="w-full h-auto rounded-lg" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Title</p>
                                <p className="text-lg font-semibold">{banner.title}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Description</p>
                                <p>{banner.description || 'No description'}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                                <Badge variant="secondary">{banner.supplier.name}</Badge>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Status</p>
                                <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                                    {banner.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Order</p>
                                <Badge variant="outline">#{banner.order}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
