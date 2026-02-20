import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { X } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/back-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import InputError from '@/components/input-error';

interface Supplier {
    id: number;
    name: string;
}

interface Props {
    suppliers: Supplier[];
}

export default function BannerCreate({ suppliers }: Props) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        image: null as File | null,
        supplier_id: '',
        is_active: true,
        order: '1',
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/banners', { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Banners', href: '/banners' }, { title: 'Create', href: '' }]}>
            <Head title="Create Banner" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <Heading title="Create Banner" description="Add a new promotional banner" />
                </div>
                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Banner Information</CardTitle>
                            <CardDescription>Fill in the details below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
                                    <InputError message={errors.image} />
                                </div>

                                {previewUrl && (
                                    <div className="relative rounded-lg border overflow-hidden">
                                        <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-96 object-contain" />
                                        <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={() => { setPreviewUrl(null); setData('image', null); }}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="supplier">Supplier</Label>
                                    <Select value={data.supplier_id} onValueChange={(value) => setData('supplier_id', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select supplier" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {suppliers.map((s) => (
                                                <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.supplier_id} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="order">Order</Label>
                                    <Input id="order" type="number" min="1" value={data.order} onChange={(e) => setData('order', e.target.value)} />
                                    <InputError message={errors.order} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => setData('is_active', !!checked)} />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Banner'}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/banners">Cancel</Link>
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
