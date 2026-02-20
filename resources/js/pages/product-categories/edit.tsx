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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

interface Supplier {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
    supplier_id: number;
}

interface Props {
    category: Category;
    suppliers: Supplier[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: '/product-categories' },
    { title: 'Edit', href: '' },
];

export default function ProductCategoryEdit({ category, suppliers }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        supplier_id: category.supplier_id.toString(),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/product-categories/${category.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${category.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <Heading
                        title={`Edit ${category.name}`}
                        description="Update category information"
                    />
                </div>

                <div className="flex justify-center">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Category Information</CardTitle>
                            <CardDescription>
                                Update the details below to edit this category
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Enter category name"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="supplier">Supplier</Label>
                                    <Select
                                        value={data.supplier_id}
                                        onValueChange={(value) =>
                                            setData('supplier_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a supplier" />
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
                                        {processing
                                            ? 'Updating...'
                                            : 'Update Category'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href="/product-categories">
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
