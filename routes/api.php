<?php

use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ProductGalleryController;
use App\Http\Controllers\Api\SupplierController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('suppliers', SupplierController::class);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('product-galleries', ProductGalleryController::class);
});
