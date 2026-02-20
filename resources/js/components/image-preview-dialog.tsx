import { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ImagePreviewDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    imageSrc: string;
    imageAlt: string;
    title?: string;
}

export function ImagePreviewDialog({
    open,
    onOpenChange,
    imageSrc,
    imageAlt,
    title,
}: ImagePreviewDialogProps) {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.25, 0.5));
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleReset = () => {
        setScale(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = imageAlt || 'image';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            handleZoomIn();
        } else {
            handleZoomOut();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
                <DialogHeader className="p-4 pb-2">
                    <DialogTitle>{title || imageAlt}</DialogTitle>
                </DialogHeader>
                
                <div className="flex flex-col gap-2 px-4">
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleZoomOut}
                            disabled={scale <= 0.5}
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[60px] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleZoomIn}
                            disabled={scale >= 3}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleRotate}
                        >
                            <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div
                    className="relative overflow-hidden bg-muted/30 flex items-center justify-center"
                    style={{ height: 'calc(95vh - 140px)' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <img
                        src={imageSrc}
                        alt={imageAlt}
                        className="max-w-full max-h-full object-contain transition-transform select-none"
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
                            cursor: isDragging ? 'grabbing' : 'grab',
                        }}
                        draggable={false}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
