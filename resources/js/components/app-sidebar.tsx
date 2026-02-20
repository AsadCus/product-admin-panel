import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Package,
    Truck,
    Image,
    Plus,
    List,
    FolderTree,
    Megaphone,
} from 'lucide-react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { useTranslation } from '@/translations';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';
import productCategories from '@/routes/product-categories';
import productGalleries from '@/routes/product-galleries';
import products from '@/routes/products';
import suppliers from '@/routes/suppliers';

export function AppSidebar() {
    const { t } = useTranslation();

    const mainNavItems: NavItem[] = [
        {
            title: t('nav.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
        {
            title: t('nav.suppliers'),
            icon: Truck,
            items: [
                {
                    title: `${t('nav.all')} ${t('nav.suppliers')}`,
                    href: suppliers.index(),
                    icon: List,
                },
                {
                    title: `${t('nav.add')} ${t('nav.suppliers')}`,
                    href: suppliers.create(),
                    icon: Plus,
                },
            ],
        },
        {
            title: t('nav.categories'),
            icon: FolderTree,
            items: [
                {
                    title: `${t('nav.all')} ${t('nav.categories')}`,
                    href: productCategories.index(),
                    icon: List,
                },
                {
                    title: `${t('nav.add')} ${t('nav.categories')}`,
                    href: productCategories.create(),
                    icon: Plus,
                },
            ],
        },
        {
            title: t('nav.products'),
            icon: Package,
            items: [
                {
                    title: `${t('nav.all')} ${t('nav.products')}`,
                    href: products.index(),
                    icon: List,
                },
                {
                    title: `${t('nav.add')} ${t('nav.products')}`,
                    href: products.create(),
                    icon: Plus,
                },
            ],
        },
        {
            title: t('nav.galleries'),
            icon: Image,
            items: [
                {
                    title: `${t('nav.all')} ${t('nav.galleries')}`,
                    href: productGalleries.index(),
                    icon: List,
                },
                {
                    title: `${t('nav.add')} ${t('nav.galleries')}`,
                    href: productGalleries.create(),
                    icon: Plus,
                },
            ],
        },
        {
            title: t('nav.banners'),
            icon: Megaphone,
            items: [
                {
                    title: `${t('nav.all')} ${t('nav.banners')}`,
                    href: '/banners',
                    icon: List,
                },
                {
                    title: `${t('nav.add')} ${t('nav.banners')}`,
                    href: '/banners/create',
                    icon: Plus,
                },
            ],
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-sidebar-accent/50"
                        >
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
