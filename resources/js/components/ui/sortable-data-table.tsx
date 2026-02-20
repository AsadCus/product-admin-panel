import type {
    DragEndEvent} from '@dnd-kit/core';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {
    ColumnDef} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { GripVertical } from 'lucide-react';
import * as React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface SortableRowProps {
    row: any;
    children: React.ReactNode;
}

function SortableRow({ row, children }: SortableRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: row.original.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <TableRow ref={setNodeRef} style={style} data-state={row.getIsSelected() && 'selected'}>
            <TableCell className="w-12.5">
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </div>
            </TableCell>
            {children}
        </TableRow>
    );
}

interface SortableDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onReorder: (newData: TData[]) => void;
}

export function SortableDataTable<TData extends { id: number }, TValue>({
    columns,
    data,
    onReorder,
}: SortableDataTableProps<TData, TValue>) {
    const [items, setItems] = React.useState(data);

    React.useEffect(() => {
        setItems(data);
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const table = useReactTable({
        data: items,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const newItems = arrayMove(items, oldIndex, newIndex);
            setItems(newItems);
            onReorder(newItems);
        }
    };

    return (
        <div className="rounded-md border">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                <TableHead className="w-12.5"></TableHead>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <SortableContext
                            items={items.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <SortableRow key={row.original.id} row={row}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </SortableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 1}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </SortableContext>
                    </TableBody>
                </Table>
            </DndContext>
        </div>
    );
}
