import { Head, Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
    updated_at: string;
}

interface Props {
    gallery: Gallery;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Galleries', href: '/product-galleries' },
    { title: 'Detail', href: '' },
];
export default function ProductGalleryShow({ gallery }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gallery Details" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <BackButton />
                        <Heading
                            title="Gallery Details"
                            description="Product gallery information"
                        />
                    </div>
                    <Button asChild className="w-full sm:w-auto shrink-0">
                        <Link href={`/product-galleries/${gallery.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Gallery
                        </Link>
                    </Button>
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Gallery Information</CardTitle>
                            <CardDescription>
                                Details about this product gallery
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                    Image Preview
                                </p>
                                <div className="rounded-lg border overflow-hidden bg-muted">
                                    <img 
                                        src={`/storage/${gallery.file_path}`} 
                                        alt="Product gallery"
                                        className="w-full h-auto max-h-96 object-contain"
                                        onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                                        }}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    File Path
                                </p>
                                <p className="mt-1 font-mono text-sm">
                                    {gallery.file_path}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Display Order
                                </p>
                                <Badge variant="outline" className="mt-2">
                                    #{gallery.order}
                                </Badge>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Product
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {gallery.product.name}
                                    </Badge>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0"
                                        asChild
                                    >
                                        <Link
                                            href={`/products/${gallery.product.id}`}
                                        >
                                            View product
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Created At
                                    </p>
                                    <p className="text-sm">
                                        {new Date(
                                            gallery.created_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Updated At
                                    </p>
                                    <p className="text-sm">
                                        {new Date(
                                            gallery.updated_at,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
