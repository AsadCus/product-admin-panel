<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductGalleryController;
use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('suppliers', SupplierController::class);
    Route::resource('product-categories', ProductCategoryController::class);
    Route::resource('products', ProductController::class);
    Route::post('products/{product}/galleries/reorder', [ProductController::class, 'reorderGalleries'])->name('products.galleries.reorder');
    Route::resource('product-galleries', ProductGalleryController::class);
    Route::post('banners/reorder', [\App\Http\Controllers\BannerController::class, 'reorderBanners'])->name('banners.reorder');
    Route::resource('banners', \App\Http\Controllers\BannerController::class);
});

require __DIR__.'/settings.php';

