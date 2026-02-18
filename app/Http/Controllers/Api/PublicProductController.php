<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;

class PublicProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['supplier', 'category', 'galleries']);

        // Filter by supplier
        if ($request->has('supplier')) {
            $query->where('supplier_id', $request->supplier);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category_id', $request->category);
        }

        $products = $query->get();

        return ProductResource::collection($products);
    }

    public function show(Product $product)
    {
        $product->load(['supplier', 'category', 'galleries']);
        
        return new ProductResource($product);
    }
}
