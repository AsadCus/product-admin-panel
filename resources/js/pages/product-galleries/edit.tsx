import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import InputError from '@/components/input-error';

interface Product {
    id: number;
    name: string;
}

interface Gallery {
    id: number;
    file_path: string;
    product_id: number;
    order: number;
}

interface Props {
    gallery: Gallery;
    products: Product[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Galleries', href: '/product-galleries' },
    { title: 'Edit', href: '' },
];
export default function ProductGalleryEdit({ gallery, products }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors } = useForm<{
        file?: File | null;
        product_id: string;
        order: string;
        _method: string;
    }>({
        file: null,
        product_id: gallery.product_id.toString(),
        order: gallery.order.toString(),
        _method: 'PUT',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('file', file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearPreview = () => {
        setPreviewUrl(null);
        setData('file', null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/product-galleries/${gallery.id}`, {
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Gallery" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/product-galleries">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Heading
                        title="Edit Gallery"
                        description="Update gallery information"
                    />
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Gallery Information</CardTitle>
                            <CardDescription>
                                Update the details below to edit this gallery
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Current Image</Label>
                                    <div className="rounded-lg border overflow-hidden bg-muted">
                                        <img 
                                            src={`/storage/${gallery.file_path}`} 
                                            alt="Current gallery"
                                            className="w-full h-auto max-h-64 object-contain"
                                            onError={(e) => {
                                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                                            }}
                                        />
                                    </div>
                                    <p className="text-sm font-mono text-muted-foreground">
                                        {gallery.file_path}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="file">
                                        New Image File (optional)
                                    </Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <InputError message={errors.file} />
                                    {data.file && (
                                        <p className="text-sm text-muted-foreground">
                                            Selected: {data.file.name} ({(data.file.size / 1024).toFixed(2)} KB)
                                        </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                        Leave empty to keep current image
                                    </p>
                                </div>

                                {previewUrl && (
                                    <div className="space-y-2">
                                        <Label>New Image Preview</Label>
                                        <div className="relative rounded-lg border overflow-hidden bg-muted">
                                            <img 
                                                src={previewUrl} 
                                                alt="Preview"
                                                className="w-full h-auto max-h-96 object-contain"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={clearPreview}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="product">Product</Label>
                                    <Select
                                        value={data.product_id}
                                        onValueChange={(value) =>
                                            setData('product_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {products.map((product) => (
                                                <SelectItem
                                                    key={product.id}
                                                    value={product.id.toString()}
                                                >
                                                    {product.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.product_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input
                                        id="order"
                                        type="number"
                                        min="0"
                                        value={data.order}
                                        onChange={(e) =>
                                            setData('order', e.target.value)
                                        }
                                        placeholder="0"
                                    />
                                    <InputError message={errors.order} />
                                    <p className="text-sm text-muted-foreground">
                                        Display order (0 = first)
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update Gallery'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href="/product-galleries">
                                            Cancel
                                        </Link>
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
