import type { DragEndEvent } from '@dnd-kit/core';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router } from '@inertiajs/react';
import {
    Plus,
    Pencil,
    Trash2,
    GripVertical,
    Package,
    Image as ImageIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/translations';

interface Specification {
    id: number;
    label: string;
    value: string;
    image_path: string | null;
    image_url: string | null;
    order: number;
}

interface ProductSpecificationsProps {
    productId: number;
    specifications: Specification[];
}

interface SortableSpecItemProps {
    spec: Specification;
    onEdit: (spec: Specification) => void;
    onDelete: (spec: Specification) => void;
}

function SortableSpecItem({ spec, onEdit, onDelete }: SortableSpecItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: spec.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
        >
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 cursor-grab opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-4 w-4" />
            </Button>
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {spec.image_url ? (
                        <img
                            src={spec.image_url}
                            alt={spec.label}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-muted-foreground">
                        {spec.label}
                    </p>
                    <p className="truncate text-base font-semibold">
                        {spec.value}
                    </p>
                </div>
            </div>
            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(spec)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => onDelete(spec)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default function ProductSpecifications({
    productId,
    specifications: initialSpecs,
}: ProductSpecificationsProps) {
    const { t } = useTranslation();
    const [specifications, setSpecifications] =
        useState<Specification[]>(initialSpecs);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingSpec, setEditingSpec] = useState<Specification | null>(null);
    const [deletingSpec, setDeletingSpec] = useState<Specification | null>(
        null,
    );
    const [formData, setFormData] = useState({
        label: '',
        value: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSpecifications((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id,
                );
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    order: index + 1,
                }));

                router.post(
                    '/product-specifications/reorder',
                    {
                        specifications: updatedItems.map((item) => ({
                            id: item.id,
                            order: item.order,
                        })),
                    },
                    {
                        preserveScroll: true,
                        onError: () => {
                            toast.error('Failed to update order');
                            setSpecifications(initialSpecs);
                        },
                    },
                );

                return updatedItems;
            });
        }
    };

    const handleAdd = () => {
        setEditingSpec(null);
        setFormData({ label: '', value: '' });
        setImageFile(null);
        setImagePreview(null);
        setDialogOpen(true);
    };

    const handleEdit = (spec: Specification) => {
        setEditingSpec(spec);
        setFormData({
            label: spec.label,
            value: spec.value,
        });
        setImageFile(null);
        setImagePreview(spec.image_url);
        setDialogOpen(true);
    };

    const handleDelete = (spec: Specification) => {
        setDeletingSpec(spec);
        setDeleteDialogOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const url = editingSpec
            ? `/product-specifications/${editingSpec.id}`
            : '/product-specifications';

        const method = editingSpec ? 'put' : 'post';

        const data = new FormData();
        data.append('label', formData.label);
        data.append('value', formData.value);

        if (!editingSpec) {
            data.append('product_id', productId.toString());
            data.append('order', (specifications.length + 1).toString());
        } else {
            data.append('order', editingSpec.order.toString());
        }

        if (imageFile) {
            data.append('image', imageFile);
        }

        if (method === 'put') {
            data.append('_method', 'put');
        }

        router.post(url, data, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    editingSpec
                        ? t('specifications.updated_success')
                        : t('specifications.created_success'),
                );
                setDialogOpen(false);
            },
            onError: () => {
                toast.error('Failed to save specification');
            },
        });
    };

    const confirmDelete = () => {
        if (!deletingSpec) return;

        router.delete(`/product-specifications/${deletingSpec.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('specifications.deleted_success'));
                setDeleteDialogOpen(false);
            },
            onError: () => {
                toast.error(t('specifications.deleted_error'));
            },
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>
                                {t('specifications.product_specs')}
                            </CardTitle>
                            <CardDescription>
                                {t('specifications.technical_details')}
                            </CardDescription>
                        </div>
                        <Button size="sm" onClick={handleAdd}>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('specifications.add')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {specifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <Package className="mb-2 h-12 w-12 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                {t('specifications.no_specifications')}
                            </p>
                            <Button
                                variant="link"
                                size="sm"
                                className="mt-2"
                                onClick={handleAdd}
                            >
                                {t('specifications.add_first')}
                            </Button>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={specifications.map((s) => s.id)}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {specifications.map((spec) => (
                                        <SortableSpecItem
                                            key={spec.id}
                                            spec={spec}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>
                                {editingSpec
                                    ? t('specifications.edit')
                                    : t('specifications.add')}
                            </DialogTitle>
                            <DialogDescription>
                                {editingSpec
                                    ? 'Update specification details'
                                    : 'Add a new specification to this product'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="image">
                                    {t('specifications.image')}
                                </Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-32 rounded-lg border object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="label">
                                    {t('specifications.label')}
                                </Label>
                                <Input
                                    id="label"
                                    value={formData.label}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            label: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. Weight, Dimensions, Material"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="value">
                                    {t('specifications.value')}
                                </Label>
                                <Input
                                    id="value"
                                    value={formData.value}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            value: e.target.value,
                                        })
                                    }
                                    placeholder="e.g. 2.5 kg, 30x20x10 cm, Stainless Steel"
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit">
                                {editingSpec
                                    ? t('common.update')
                                    : t('common.create')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('specifications.delete_confirm')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('specifications.delete_warning')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('common.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                            {t('common.delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
