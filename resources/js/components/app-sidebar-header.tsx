import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Moon, Sun, Languages, Check } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { useLanguage } from '@/hooks/use-language';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { updateAppearance } = useAppearance();
    const { language, updateLanguage } = useLanguage();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                        >
                            <Languages className="h-4 w-4" />
                            <span className="sr-only">Change language</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => updateLanguage('en')}
                            className="flex items-center justify-between"
                        >
                            English
                            {language === 'en' && (
                                <Check className="ml-2 h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => updateLanguage('id')}
                            className="flex items-center justify-between"
                        >
                            Bahasa Indonesia
                            {language === 'id' && (
                                <Check className="ml-2 h-4 w-4" />
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Dark Mode Toggle */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                        >
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => updateAppearance('light')}
                        >
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => updateAppearance('dark')}
                        >
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => updateAppearance('system')}
                        >
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
