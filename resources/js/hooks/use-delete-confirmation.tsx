import { useState } from 'react';
import { router } from '@inertiajs/react';
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

interface UseDeleteConfirmationProps {
    title?: string;
    description?: string;
    successMessage?: string;
    errorMessage?: string;
}

export function useDeleteConfirmation({
    title = 'Are you sure?',
    description = 'This action cannot be undone. This will permanently delete the item.',
    successMessage = 'Item deleted successfully',
    errorMessage = 'Failed to delete item',
}: UseDeleteConfirmationProps = {}) {
    const [isOpen, setIsOpen] = useState(false);
    const [deleteUrl, setDeleteUrl] = useState<string>('');
    const [itemName, setItemName] = useState<string>('');

    const confirmDelete = (url: string, name?: string) => {
        setDeleteUrl(url);
        setItemName(name || '');
        setIsOpen(true);
    };

    const handleDelete = () => {
        router.delete(deleteUrl, {
            onSuccess: () => {
                toast.success(successMessage);
                setIsOpen(false);
            },
            onError: () => {
                toast.error(errorMessage);
            },
        });
    };

    const DeleteConfirmationDialog = () => (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                        {itemName && (
                            <span className="mt-2 block font-semibold text-foreground">
                                {itemName}
                            </span>
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return {
        confirmDelete,
        DeleteConfirmationDialog,
    };
}
