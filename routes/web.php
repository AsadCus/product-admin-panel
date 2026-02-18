<?php

use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductGalleryController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    // Get basic stats
    $stats = [
        'products' => \App\Models\Product::count(),
        'suppliers' => \App\Models\Supplier::count(),
        'categories' => \App\Models\ProductCategory::count(),
        'galleries' => \App\Models\ProductGallery::count(),
    ];
    
    // Get products by supplier for chart
    $productsBySupplier = \App\Models\Supplier::withCount('products')
        ->orderBy('products_count', 'desc')
        ->limit(5)
        ->get()
        ->map(fn($supplier) => [
            'name' => $supplier->name,
            'count' => $supplier->products_count,
        ]);
    
    // Get products by category for chart
    $productsByCategory = \App\Models\ProductCategory::withCount('products')
        ->orderBy('products_count', 'desc')
        ->limit(5)
        ->get()
        ->map(fn($category) => [
            'name' => $category->name,
            'count' => $category->products_count,
        ]);
    
    // Get recent products
    $recentProducts = \App\Models\Product::with('supplier')
        ->latest()
        ->limit(5)
        ->get()
        ->map(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'supplier' => $product->supplier->name,
            'created_at' => $product->created_at->diffForHumans(),
        ]);
    
    // Get all categories with product count
    $allCategories = \App\Models\ProductCategory::withCount('products')
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
    
    // Get all products with supplier
    $allProducts = \App\Models\Product::with('supplier')
        ->orderBy('name')
        ->limit(10)
        ->get()
        ->map(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'supplier' => $product->supplier->name,
        ]);
    
    return Inertia::render('dashboard', [
        'stats' => $stats,
        'productsBySupplier' => $productsBySupplier,
        'productsByCategory' => $productsByCategory,
        'recentProducts' => $recentProducts,
        'allCategories' => $allCategories,
        'allProducts' => $allProducts,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('suppliers', SupplierController::class);
    Route::resource('product-categories', ProductCategoryController::class);
    Route::resource('products', ProductController::class);
    Route::resource('product-galleries', ProductGalleryController::class);
});

require __DIR__.'/settings.php';

