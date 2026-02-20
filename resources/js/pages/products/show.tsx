import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Package, Trash2, GripVertical } from 'lucide-react';
import { useState } from 'react';
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
import { useTranslation } from '@/translations';
import { useDeleteConfirmation } from '@/hooks/use-delete-confirmation';
import { ImagePreviewDialog } from '@/components/image-preview-dialog';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

interface Supplier {
    id: number;
    name: string;
    desc: string | null;
}

interface Gallery {
    id: number;
    file_path: string;
    file_url: string | null;
    order: number;
}

interface Product {
    id: number;
    name: string;
    description: string | null;
    supplier: Supplier;
    galleries: Gallery[];
    created_at: string;
    updated_at: string;
}

interface Props {
    product: Product;
}

interface SortableGalleryItemProps {
    gallery: Gallery;
    productName: string;
    onDelete: (url: string, name: string) => void;
    onImageClick: (imageSrc: string, title: string) => void;
    t: (key: any) => string;
}

function SortableGalleryItem({
    gallery,
    productName,
    onDelete,
    onImageClick,
    t,
}: SortableGalleryItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: gallery.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative overflow-hidden rounded-lg border"
        >
            <div className="aspect-square cursor-pointer" onClick={() => onImageClick(gallery.file_url || '', `${productName} - #${gallery.order}`)}>
                {gallery.file_url ? (
                    <img
                        src={gallery.file_url}
                        alt={`${productName} - ${gallery.order}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                            console.error(
                                'Failed to load image:',
                                gallery.file_url,
                            );
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML =
                                '<div class="flex h-full items-center justify-center bg-muted"><svg class="h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
                        }}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted">
                        <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
            </div>
            <div className="absolute top-2 left-2">
                <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4" />
                </Button>
            </div>
            <div className="absolute top-2 right-2">
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                        onDelete(
                            `/product-galleries/${gallery.id}`,
                            `${productName} - #${gallery.order}`,
                        )
                    }
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <div className="flex items-center justify-between">
                    <Badge variant="secondary">#{gallery.order}</Badge>
                    <Button variant="secondary" size="sm" asChild>
                        <Link href={`/product-galleries/${gallery.id}`}>
                            {t('common.view')}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function ProductShow({ product }: Props) {
    const { t } = useTranslation();
    const { confirmDelete, DeleteConfirmationDialog } = useDeleteConfirmation({
        title: t('common.confirm_delete'),
        description: t('galleries.delete_warning'),
        successMessage: t('galleries.deleted_success'),
        errorMessage: t('galleries.deleted_error'),
    });

    const [galleries, setGalleries] = useState<Gallery[]>(product.galleries);
    const [imagePreview, setImagePreview] = useState<{ open: boolean; src: string; title: string }>({
        open: false,
        src: '',
        title: '',
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setGalleries((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id,
                );
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order values (start from 1)
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    order: index + 1,
                }));

                // Send update to backend
                router.post(
                    `/products/${product.id}/galleries/reorder`,
                    {
                        galleries: updatedItems.map((item) => ({
                            id: item.id,
                            order: item.order,
                        })),
                    },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            toast.success('Gallery order updated successfully');
                        },
                        onError: () => {
                            toast.error('Failed to update gallery order');
                            setGalleries(product.galleries);
                        },
                    },
                );

                return updatedItems;
            });
        }
    };

    // Debug: log the product data
    console.log('Product data:', product);
    console.log('Galleries:', product.galleries);

    const handleImageClick = (src: string, title: string) => {
        setImagePreview({ open: true, src, title });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('products.title'), href: '/products' },
        { title: t('common.detail'), href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <BackButton />
                        <Heading
                            title={product.name}
                            description={t('products.details')}
                        />
                    </div>
                    <Button asChild className="w-full sm:w-auto shrink-0">
                        <Link href="/product-galleries/create">
                            <Pencil className="mr-2 h-4 w-4" />
                            {t('galleries.add')}
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>
                                        {t('products.information')}
                                    </CardTitle>
                                    <CardDescription>
                                        {t('products.basic_details')}
                                    </CardDescription>
                                </div>
                                <Button size="sm" asChild>
                                    <Link href={`/products/${product.id}/edit`}>
                                        <Pencil className="mr-2 h-3 w-3" />
                                        {t('products.edit')}
                                    </Link>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('common.name')}
                                </p>
                                <p className="text-lg font-semibold">
                                    {product.name}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('common.description')}
                                </p>
                                <p className="mt-1">
                                    {product.description || (
                                        <span className="text-muted-foreground">
                                            {t('common.no_description')}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {t('products.supplier')}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {product.supplier.name}
                                    </Badge>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0"
                                        asChild
                                    >
                                        <Link
                                            href={`/suppliers/${product.supplier.id}`}
                                        >
                                            {t('suppliers.view_supplier')}
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('products.galleries')}</CardTitle>
                            <CardDescription>
                                {t('products.images_associated')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {galleries.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <Package className="mb-2 h-12 w-12 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {t('products.no_galleries_yet')}
                                    </p>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="mt-2"
                                        asChild
                                    >
                                        <Link href="/product-galleries/create">
                                            {t('galleries.add')}
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={galleries.map((g) => g.id)}
                                        strategy={rectSortingStrategy}
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            {galleries.map((gallery) => (
                                                <SortableGalleryItem
                                                    key={gallery.id}
                                                    gallery={gallery}
                                                    productName={product.name}
                                                    onDelete={confirmDelete}
                                                    onImageClick={handleImageClick}
                                                    t={t}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}
                            <DeleteConfirmationDialog />
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('common.metadata')}</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('common.created_at')}
                            </p>
                            <p className="text-sm">
                                {new Date(product.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {t('common.updated_at')}
                            </p>
                            <p className="text-sm">
                                {new Date(product.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <ImagePreviewDialog
                open={imagePreview.open}
                onOpenChange={(open) => setImagePreview({ ...imagePreview, open })}
                imageSrc={imagePreview.src}
                imageAlt={imagePreview.title}
                title={imagePreview.title}
            />
        </AppLayout>
    );
}
