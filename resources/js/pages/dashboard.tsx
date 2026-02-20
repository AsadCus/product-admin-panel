import { Head, Link } from '@inertiajs/react';
import {
    Package,
    Truck,
    Image,
    ArrowRight,
    FolderTree,
    TrendingUp,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import productCategories from '@/routes/product-categories';
import productGalleries from '@/routes/product-galleries';
import products from '@/routes/products';
import suppliers from '@/routes/suppliers';
import { useTranslation } from '@/translations';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface ChartData {
    name: string;
    count: number;
}

interface RecentProduct {
    id: number;
    name: string;
    supplier: string;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
    supplier: string;
    products_count: number;
}

interface Product {
    id: number;
    name: string;
    supplier: string;
}

interface Props {
    stats?: {
        products: number;
        suppliers: number;
        categories: number;
        galleries: number;
    };
    productsBySupplier?: ChartData[];
    productsByCategory?: ChartData[];
    recentProducts?: RecentProduct[];
    allCategories?: Category[];
    allProducts?: Product[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Dashboard({
    stats,
    productsBySupplier = [],
    productsByCategory = [],
    recentProducts = [],
    allCategories = [],
    allProducts = [],
}: Props) {
    const { t } = useTranslation();
    const statistics = stats || {
        products: 0,
        suppliers: 0,
        categories: 0,
        galleries: 0,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {t('dashboard.title')}
                    </h2>
                    <p className="text-muted-foreground">
                        {t('dashboard.welcome')}
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('dashboard.total_suppliers')}
                            </CardTitle>
                            <Truck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.suppliers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('dashboard.active_suppliers')}
                            </p>
                            <Button
                                variant="link"
                                className="mt-2 h-auto p-0"
                                asChild
                            >
                                <Link href={suppliers.index.url()}>
                                    {t('dashboard.view_all')}
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('dashboard.total_categories')}
                            </CardTitle>
                            <FolderTree className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.categories}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('dashboard.product_categories')}
                            </p>
                            <Button
                                variant="link"
                                className="mt-2 h-auto p-0"
                                asChild
                            >
                                <Link href={productCategories.index.url()}>
                                    {t('dashboard.view_all')}
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('dashboard.total_products')}
                            </CardTitle>
                            <Package className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.products}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('dashboard.products_in_store')}
                            </p>
                            <Button
                                variant="link"
                                className="mt-2 h-auto p-0"
                                asChild
                            >
                                <Link href={products.index.url()}>
                                    {t('dashboard.view_all')}
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="transition-shadow hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('dashboard.total_galleries')}
                            </CardTitle>
                            <Image className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {statistics.galleries}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('dashboard.product_images')}
                            </p>
                            <Button
                                variant="link"
                                className="mt-2 h-auto p-0"
                                asChild
                            >
                                <Link href={productGalleries.index.url()}>
                                    {t('dashboard.view_all')}
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Bar Chart - Products by Supplier */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                {t('dashboard.products_by_supplier')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {productsBySupplier.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={productsBySupplier}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="name"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                        />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar
                                            dataKey="count"
                                            fill="#8884d8"
                                            radius={[8, 8, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                                    {t('dashboard.no_data')}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pie Chart - Products by Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FolderTree className="h-5 w-5" />
                                {t('dashboard.products_by_category')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {productsByCategory.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={productsByCategory}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry: any) =>
                                                `${entry.name}: ${entry.count}`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {productsByCategory.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={
                                                            COLORS[
                                                                index %
                                                                    COLORS.length
                                                            ]
                                                        }
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                                    {t('dashboard.no_data')}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Categories and Products Lists */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* All Categories */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <FolderTree className="h-5 w-5" />
                                {t('dashboard.all_categories')}
                            </CardTitle>
                            <Button variant="link" size="sm" asChild>
                                <Link href={productCategories.index.url()}>
                                    {t('dashboard.view_all')}
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {allCategories.length > 0 ? (
                                <div className="space-y-2">
                                    {allCategories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {category.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {category.supplier}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">
                                                        {
                                                            category.products_count
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {t(
                                                            'dashboard.products',
                                                        )}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/product-categories/${category.id}`}
                                                    >
                                                        {t('common.view')}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-muted-foreground">
                                    {t('dashboard.no_categories')}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* All Products */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                {t('dashboard.all_products')}
                            </CardTitle>
                            <Button variant="link" size="sm" asChild>
                                <Link href={products.index.url()}>
                                    {t('dashboard.view_all')}
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {allProducts.length > 0 ? (
                                <div className="space-y-2">
                                    {allProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                                        >
                                            <div className="flex-1">
                                                <p className="font-medium">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.supplier}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={`/products/${product.id}`}
                                                >
                                                    {t('common.view')}
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-muted-foreground">
                                    {t('dashboard.no_products')}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('dashboard.recent_products')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentProducts.length > 0 ? (
                                <div className="space-y-3">
                                    {recentProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {product.supplier}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-muted-foreground">
                                                    {product.created_at}
                                                </p>
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    className="h-auto p-0"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/products/${product.id}`}
                                                    >
                                                        {t('common.view')}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="py-8 text-center text-muted-foreground">
                                    {t('dashboard.no_products')}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('dashboard.quick_actions')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button className="w-full justify-start" asChild>
                                <Link href={products.create.url()}>
                                    <Package className="mr-2 h-4 w-4" />
                                    {t('dashboard.add_new_product')}
                                </Link>
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                asChild
                            >
                                <Link href={suppliers.create.url()}>
                                    <Truck className="mr-2 h-4 w-4" />
                                    {t('dashboard.add_new_supplier')}
                                </Link>
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                asChild
                            >
                                <Link href={productCategories.create.url()}>
                                    <FolderTree className="mr-2 h-4 w-4" />
                                    {t('dashboard.add_new_category')}
                                </Link>
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                asChild
                            >
                                <Link href={productGalleries.create.url()}>
                                    <Image className="mr-2 h-4 w-4" />
                                    {t('dashboard.add_new_gallery')}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
