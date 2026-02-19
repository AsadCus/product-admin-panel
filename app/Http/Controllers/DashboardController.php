<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductGallery;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics and charts data.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard', [
            'stats' => $this->getStats(),
            'productsBySupplier' => $this->getProductsBySupplier(),
            'productsByCategory' => $this->getProductsByCategory(),
            'recentProducts' => $this->getRecentProducts(),
            'allCategories' => $this->getAllCategories(),
            'allProducts' => $this->getAllProducts(),
        ]);
    }

    /**
     * Get basic statistics for dashboard cards.
     */
    private function getStats(): array
    {
        return [
            'products' => Product::count(),
            'suppliers' => Supplier::count(),
            'categories' => ProductCategory::count(),
            'galleries' => ProductGallery::count(),
        ];
    }

    /**
     * Get products count by supplier for bar chart.
     */
    private function getProductsBySupplier(): \Illuminate\Support\Collection
    {
        return Supplier::withCount('products')
            ->orderBy('products_count', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($supplier) => [
                'name' => $supplier->name,
                'count' => $supplier->products_count,
            ]);
    }

    /**
     * Get products count by category for pie chart.
     */
    private function getProductsByCategory(): \Illuminate\Support\Collection
    {
        return ProductCategory::withCount('products')
            ->orderBy('products_count', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($category) => [
                'name' => $category->name,
                'count' => $category->products_count,
            ]);
    }

    /**
     * Get recent products for dashboard display.
     */
    private function getRecentProducts(): \Illuminate\Support\Collection
    {
        return Product::with('supplier')
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'supplier' => $product->supplier->name,
                'created_at' => $product->created_at->diffForHumans(),
            ]);
    }

    /**
     * Get all categories with product count for dashboard display.
     */
    private function getAllCategories(): \Illuminate\Support\Collection
    {
        return ProductCategory::withCount('products')
            ->with('supplier')
            ->orderBy('name')
            ->limit(10)
            ->get()
            ->map(fn($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'supplier' => $category->supplier->name,
                'products_count' => $category->products_count,
            ]);
    }

    /**
     * Get all products with supplier for dashboard display.
     */
    private function getAllProducts(): \Illuminate\Support\Collection
    {
        return Product::with('supplier')
            ->orderBy('name')
            ->limit(10)
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'supplier' => $product->supplier->name,
            ]);
    }
}