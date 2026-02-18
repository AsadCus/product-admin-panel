<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductGalleryController;
use App\Http\Controllers\Api\PublicProductController;
use App\Http\Controllers\Api\SupplierController;
use Illuminate\Support\Facades\Route;

// Public API - no auth required
Route::get('products', [PublicProductController::class, 'index'])->name('public.products.index');
Route::get('products/{product}', [PublicProductController::class, 'show'])->name('public.products.show');

// Protected API - auth required
Route::middleware('auth:sanctum')->prefix('api')->name('api.')->group(function () {
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('product-galleries', ProductGalleryController::class);
});
