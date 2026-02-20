<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductGalleryRequest;
use App\Http\Requests\UpdateProductGalleryRequest;
use App\Http\Resources\ProductGalleryResource;
use App\Models\ProductGallery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductGalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $galleries = ProductGallery::query()
            ->with('product')
            ->orderBy('order')
            ->paginate(10);

        return ProductGalleryResource::collection($galleries);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductGalleryRequest $request): JsonResponse
    {
        $gallery = ProductGallery::create($request->validated());
        $gallery->load('product');

        return response()->json([
            'message' => 'Galeri produk berhasil ditambahkan.',
            'data' => new ProductGalleryResource($gallery),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductGallery $productGallery): ProductGalleryResource
    {
        $productGallery->load('product');

        return new ProductGalleryResource($productGallery);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductGalleryRequest $request, ProductGallery $productGallery): JsonResponse
    {
        $productGallery->update($request->validated());
        $productGallery->load('product');

        return response()->json([
            'message' => 'Galeri produk berhasil diperbarui.',
            'data' => new ProductGalleryResource($productGallery),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductGallery $productGallery): JsonResponse
    {
        $productGallery->delete();

        return response()->json([
            'message' => 'Galeri produk berhasil dihapus.',
        ]);
    }
}
