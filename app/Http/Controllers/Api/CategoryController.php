<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductCategoryRequest;
use App\Http\Requests\UpdateProductCategoryRequest;
use App\Http\Resources\ProductCategoryResource;
use App\Models\ProductCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $categories = ProductCategory::query()
            ->with('supplier')
            ->withCount('products')
            ->orderBy('order')
            ->latest()
            ->paginate(10);

        return ProductCategoryResource::collection($categories);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductCategoryRequest $request): JsonResponse
    {
        $category = ProductCategory::create($request->validated());

        return response()->json([
            'message' => 'Category berhasil ditambahkan.',
            'data' => new ProductCategoryResource($category),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductCategory $category): ProductCategoryResource
    {
        $category->load(['supplier', 'products']);

        return new ProductCategoryResource($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductCategoryRequest $request, ProductCategory $category): JsonResponse
    {
        $category->update($request->validated());

        return response()->json([
            'message' => 'Category berhasil diperbarui.',
            'data' => new ProductCategoryResource($category),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductCategory $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'message' => 'Category berhasil dihapus.',
        ]);
    }

    /**
     * Update the order of categories.
     */
    public function reorder(\Illuminate\Http\Request $request): JsonResponse
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:product_categories,id',
            'categories.*.order' => 'required|integer',
        ]);

        foreach ($request->categories as $categoryData) {
            ProductCategory::where('id', $categoryData['id'])
                ->update(['order' => $categoryData['order']]);
        }

        return response()->json([
            'message' => 'Urutan kategori berhasil diperbarui.',
        ]);
    }
}