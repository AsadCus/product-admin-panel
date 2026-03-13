<?php

use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductGalleryController;
use App\Http\Controllers\Api\ProductSpecificationController;
use App\Http\Controllers\Api\PublicProductController;
use App\Http\Controllers\Api\SupplierController;
use Illuminate\Support\Facades\Route;

// Public API - no auth required
Route::get('products', [PublicProductController::class, 'index'])->name('public.products.index');
Route::get('products/{product}', [PublicProductController::class, 'show'])->name('public.products.show');
Route::get('products/{product}/specifications', [ProductSpecificationController::class, 'index'])->name('public.products.specifications.index');
Route::get('product-specifications/{productSpecification}', [ProductSpecificationController::class, 'show'])->name('public.product-specifications.show');

// Public Banner API
Route::get('banners', [BannerController::class, 'index'])->name('public.banners.index');
Route::get('banners/active', [BannerController::class, 'active'])->name('public.banners.active');
Route::get('banners/supplier/{supplierId}', [BannerController::class, 'bySupplier'])->name('public.banners.by-supplier');
Route::get('banners/{banner}', [BannerController::class, 'show'])->name('public.banners.show');

// Protected API - auth required
Route::middleware('auth:sanctum')->prefix('api')->name('api.')->group(function () {
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::post('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');
    Route::apiResource('products', ProductController::class);
    Route::apiResource('product-galleries', ProductGalleryController::class);
});
