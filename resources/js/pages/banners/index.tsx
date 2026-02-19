import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, GripVertical, MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
import { useTranslation } from '@/translations';

interface Banner {
    id: number;
    title: string;
    description: string | null;
    image_path: string;
    supplier: { id: number; name: string };
    is_active: boolean;
    order: number;
}

interface Props {
    banners: { data: Banner[] };
}

interface SortableBannerItemProps {
    banner: Banner;
    onDelete: (id: number, title: string) => void;
    t: ReturnType<typeof useTranslation>['t'];
}

function SortableBannerItem({ banner, onDelete, t }: SortableBannerItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: banner.id });

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
            
            <img src={`/storage/${banner.image_path}`} alt={banner.title} className="h-20 w-32 rounded object-cover" />
            
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{banner.title}</h3>
                    <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                        {banner.is_active ? t('banners.active') : t('banners.inactive')}
                    </Badge>
                    <Badge variant="outline">#{banner.order}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{banner.description || t('banners.no_description')}</p>
                <Badge variant="secondary" className="mt-1">{banner.supplier.name}</Badge>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.visit(`/banners/${banner.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t('banners.view')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.visit(`/banners/${banner.id}/edit`)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t('banners.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(banner.id, banner.title)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('banners.delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default function BannersIndex({ banners }: Props) {
    const { t } = useTranslation();
    
    // Group banners by supplier
    const bannersBySupplier = banners.data.reduce((acc, banner) => {
        const supplierId = banner.supplier.id;
        if (!acc[supplierId]) {
            acc[supplierId] = {
                supplier: banner.supplier,
                banners: [],
            };
        }
        acc[supplierId].banners.push(banner);
        return acc;
    }, {} as Record<number, { supplier: { id: number; name: string }; banners: Banner[] }>);

    const [supplierBanners, setSupplierBanners] = useState(bannersBySupplier);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null; title: string }>({
        open: false,
        id: null,
        title: '',
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (supplierId: number) => (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setSupplierBanners((prev) => {
                const supplierData = prev[supplierId];
                const items = supplierData.banners;
                
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                const orderUpdates = newItems.map((item, index) => ({
                    id: item.id,
                    order: index + 1,
                }));

                router.post(
                    '/banners/reorder',
                    { supplier_id: supplierId, banners: orderUpdates },
                    {
                        preserveScroll: true,
                        onSuccess: () => {
                            toast.success(t('banners.order_updated'));
                        },
                        onError: () => {
                            toast.error(t('banners.order_failed'));
                            setSupplierBanners(prev);
                        },
                    }
                );

                return {
                    ...prev,
                    [supplierId]: {
                        ...supplierData,
                        banners: newItems,
                    },
                };
            });
        }
    };

    const handleDelete = (id: number, title: string) => {
        setDeleteDialog({ open: true, id, title });
    };

    const confirmDelete = () => {
        if (!deleteDialog.id) return;

        router.delete(`/banners/${deleteDialog.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Update local state to remove the deleted banner
                setSupplierBanners((prev) => {
                    const newState = { ...prev };
                    
                    // Find and remove the banner from the appropriate supplier
                    Object.keys(newState).forEach((supplierId) => {
                        const supplierData = newState[Number(supplierId)];
                        const filteredBanners = supplierData.banners.filter((b) => b.id !== deleteDialog.id);
                        
                        if (filteredBanners.length !== supplierData.banners.length) {
                            // Banner was found and removed
                            if (filteredBanners.length === 0) {
                                // Remove supplier group if no banners left
                                delete newState[Number(supplierId)];
                            } else {
                                newState[Number(supplierId)] = {
                                    ...supplierData,
                                    banners: filteredBanners,
                                };
                            }
                        }
                    });
                    
                    return newState;
                });
                toast.success(t('banners.deleted_success'));
                setDeleteDialog({ open: false, id: null, title: '' });
            },
            onError: () => {
                toast.error(t('banners.deleted_failed'));
                setDeleteDialog({ open: false, id: null, title: '' });
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: t('banners.title'), href: '/banners' }]}>
            <Head title={t('banners.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading title={t('banners.title')} description={t('banners.manage')} />
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/banners/create">
                            <Plus className="mr-2 h-4 w-4" />
                            {t('banners.add')}
                        </Link>
                    </Button>
                </div>

                {Object.keys(supplierBanners).length === 0 && (
                    <Card>
                        <CardContent className="py-8">
                            <p className="text-center text-muted-foreground">{t('banners.no_banners')}</p>
                        </CardContent>
                    </Card>
                )}

                {Object.entries(supplierBanners).map(([supplierId, { supplier, banners: items }]) => (
                    <Card key={supplierId}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {supplier.name}
                                <Badge variant="secondary">{items.length} {t('banners.count')}{items.length !== 1 ? 's' : ''}</Badge>
                            </CardTitle>
                            <CardDescription>{t('banners.drag_to_reorder')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd(Number(supplierId))}>
                                <SortableContext items={items.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-2">
                                        {items.map((banner) => (
                                            <SortableBannerItem key={banner.id} banner={banner} onDelete={handleDelete} t={t} />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('banners.delete_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('banners.delete_description').replace('{title}', deleteDialog.title)}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, id: null, title: '' })}>
                            {t('banners.delete_cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {t('banners.delete_confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
