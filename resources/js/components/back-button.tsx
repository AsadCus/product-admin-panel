import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
    className?: string;
}

export default function BackButton({ className }: BackButtonProps) {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className={className}
        >
            <ArrowLeft className="h-4 w-4" />
        </Button>
    );
}