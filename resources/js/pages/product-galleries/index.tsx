import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, GripVertical, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/translations';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';

interface Gallery {
    id: number;
    file_path: string;
    order: number;
    product: {
        id: number;
        name: string;
        supplier: { id: number; name: string };
        category: { id: number; name: string };
    };
}

interface Props {
    galleries: {
        data: Gallery[];
    };
}

interface SortableGalleryItemProps {
    gallery: Gallery;
    onDelete: (id: number, productName: string) => void;
}

function SortableGalleryItem({ gallery, onDelete }: SortableGalleryItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: gallery.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="group relative flex items-center gap-4 rounded-lg border bg-card p-4 hover:bg-accent/50">
            <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
            </button>
            
            <img src={`/storage/${gallery.file_path}`} alt={`Gallery ${gallery.order}`} className="h-20 w-32 rounded object-cover" />
            
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{gallery.product.name}</h3>
                    <Badge variant="outline">#{gallery.order}</Badge>
                </div>
                <div className="flex gap-2 mt-1">
                    <Badge variant="secondary">{gallery.product.supplier.name}</Badge>
                    <Badge variant="outline">{gallery.product.category.name}</Badge>
                </div>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.visit(`/product-galleries/${gallery.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.visit(`/product-galleries/${gallery.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(gallery.id, gallery.product.name)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default function ProductGalleriesIndex({ galleries }: Props) {
    const { t } = useTranslation();

    // Group galleries by supplier > category > product
    const groupedGalleries = galleries.data.reduce((acc, gallery) => {
        const supplierId = gallery.product.supplier.id;
        const categoryId = gallery.product.category.id;
        const productId = gallery.product.id;

        if (!acc[supplierId]) {
            acc[supplierId] = {
                supplier: gallery.product.supplier,
                categories: {},
            };
        }

        if (!acc[supplierId].categories[categoryId]) {
            acc[supplierId].categories[categoryId] = {
                category: gallery.product.category,
                products: {},
            };
        }

        if (!acc[supplierId].categories[categoryId].products[productId]) {
            acc[supplierId].categories[categoryId].products[productId] = {
                product: gallery.product,
                galleries: [],
            };
        }

        acc[supplierId].categories[categoryId].products[productId].galleries.push(gallery);
        return acc;
    }, {} as Record<number, {
        supplier: { id: number; name: string };
        categories: Record<number, {
            category: { id: number; name: string };
            products: Record<number, {
                product: { id: number; name: string };
                galleries: Gallery[];
            }>;
        }>;
    }>);

    const [supplierData, setSupplierData] = useState(groupedGalleries);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const { confirmDelete, DeleteConfirmationDialog } = useDeleteConfirmation({
        title: 'Delete Gallery?',
        description: 'This will permanently delete the gallery image.',
        successMessage: 'Gallery deleted successfully',
        errorMessage: 'Failed to delete gallery',
    });

    const handleDragEnd = (productId: number) => (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSupplierData((prev) => {
                // Find the product's galleries
                let targetGalleries: Gallery[] = [];
                let supplierId = 0;
                let categoryId = 0;

                Object.entries(prev).forEach(([sId, sData]) => {
                    Object.entries(sData.categories).forEach(([cId, cData]) => {
                        if (cData.products[productId]) {
                            targetGalleries = cData.products[productId].galleries;
                            supplierId = Number(sId);
                            categoryId = Number(cId);
                        }
                    });
                });

                const oldIndex = targetGalleries.findIndex((item) => item.id === active.id);
                const newIndex = targetGalleries.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(targetGalleries, oldIndex, newIndex);

                const orderUpdates = newItems.map((item, index) => ({
                    id: item.id,
                    order: index + 1,
                }));

                router.post(
                    `/products/${productId}/galleries/reorder`,
                    { galleries: orderUpdates },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            toast.success('Gallery order updated successfully');
                        },
                        onError: () => {
                            toast.error('Failed to update gallery order');
                            setSupplierData(prev);
                        },
                    }
                );

                return {
                    ...prev,
                    [supplierId]: {
                        ...prev[supplierId],
                        categories: {
                            ...prev[supplierId].categories,
                            [categoryId]: {
                                ...prev[supplierId].categories[categoryId],
                                products: {
                                    ...prev[supplierId].categories[categoryId].products,
                                    [productId]: {
                                        ...prev[supplierId].categories[categoryId].products[productId],
                                        galleries: newItems,
                                    },
                                },
                            },
                        },
                    },
                };
            });
        }
    };

    const handleDelete = (id: number, productName: string) => {
        confirmDelete(`/product-galleries/${id}`, productName);
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('galleries.title'), href: '/product-galleries' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('galleries.title')} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title={t('galleries.title')}
                        description="Manage product galleries - grouped by supplier, category, and product"
                    />
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/product-galleries/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('galleries.add')}
                        </Link>
                    </Button>
                </div>

                {Object.keys(supplierData).length === 0 && (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-muted-foreground">No galleries found. Create one to get started.</p>
                        </CardContent>
                    </Card>
                )}

                {Object.entries(supplierData).map(([supplierId, { supplier, categories }]) => (
                    <div key={supplierId} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold">{supplier.name}</h2>
                            <Badge variant="secondary">
                                {Object.values(categories).reduce((sum, cat) => sum + Object.keys(cat.products).length, 0)} products
                            </Badge>
                        </div>

                        {Object.entries(categories).map(([categoryId, { category, products }]) => (
                            <Card key={categoryId}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        {category.name}
                                        <Badge variant="outline">{Object.keys(products).length} products</Badge>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {Object.entries(products).map(([productId, { product, galleries: items }]) => (
                                        <div key={productId} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold">{product.name}</h4>
                                                <Badge variant="secondary">{items.length} images</Badge>
                                            </div>
                                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(Number(productId))}>
                                                <SortableContext items={items.map((g) => g.id)} strategy={verticalListSortingStrategy}>
                                                    <div className="space-y-2">
                                                        {items.map((gallery) => (
                                                            <SortableGalleryItem key={gallery.id} gallery={gallery} onDelete={handleDelete} />
                                                        ))}
                                                    </div>
                                                </SortableContext>
                                            </DndContext>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>
            <DeleteConfirmationDialog />
        </AppLayout>
    );
}
