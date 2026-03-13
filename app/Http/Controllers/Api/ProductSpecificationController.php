<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductSpecificationResource;
use App\Models\Product;
use App\Models\ProductSpecification;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductSpecificationController extends Controller
{
    /**
     * Get all specifications for a specific product
     */
    public function index(Product $product): AnonymousResourceCollection
    {
        $specifications = $product->specifications()
            ->orderBy('order')
            ->get();

        return ProductSpecificationResource::collection($specifications);
    }

    /**
     * Get a single specification by ID
     */
    public function show(ProductSpecification $productSpecification): ProductSpecificationResource
    {
        return new ProductSpecificationResource($productSpecification);
    }
}
