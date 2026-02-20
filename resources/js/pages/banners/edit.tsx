import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import BackButton from '@/components/back-button';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';

interface Banner {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    supplier_id: number;
    is_active: boolean;
    order: number;
}

interface Props {
    banner: Banner;
    suppliers: { id: number; name: string }[];
}

export default function BannerEdit({ banner, suppliers }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        title: banner.title,
        description: banner.description || '',
        image: null as File | null,
        supplier_id: banner.supplier_id.toString(),
        is_active: banner.is_active,
        order: banner.order.toString(),
        _method: 'PUT',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/banners/${banner.id}`, { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Banners', href: '/banners' }, { title: 'Edit', href: '' }]}>
            <Head title="Edit Banner" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <Heading title="Edit Banner" />
                </div>
                <Card className="max-w-2xl mx-auto w-full">
                    <CardHeader>
                        <CardTitle>Banner Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Current Image</Label>
                                <img src={`/storage/${banner.image_path}`} alt={banner.title} className="w-full h-auto max-h-64 object-contain rounded border" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                <InputError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">New Image (optional)</Label>
                                <Input id="image" type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setData('image', file);
                                        const reader = new FileReader();
                                        reader.onloadend = () => setPreviewUrl(reader.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </div>

                            {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-64 object-contain rounded border" />}

                            <div className="space-y-2">
                                <Label>Supplier</Label>
                                <Select value={data.supplier_id} onValueChange={(value) => setData('supplier_id', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {suppliers.map((s) => <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="order">Order</Label>
                                <Input id="order" type="number" min="1" value={data.order} onChange={(e) => setData('order', e.target.value)} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', !!checked)} />
                                <Label htmlFor="is_active">Active</Label>
                            </div>

                            <div className="flex gap-4">
                                <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update'}</Button>
                                <Button type="button" variant="outline" asChild><Link href="/banners">Cancel</Link></Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
