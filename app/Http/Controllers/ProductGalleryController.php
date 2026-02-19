<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductGalleryRequest;
use App\Http\Requests\UpdateProductGalleryRequest;
use App\Models\Product;
use App\Models\ProductGallery;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductGalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $galleries = ProductGallery::query()
            ->with(['product.supplier', 'product.category'])
            ->orderBy('order')
            ->get();

        return Inertia::render('product-galleries/index', [
            'galleries' => ['data' => $galleries],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $products = Product::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('product-galleries/create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductGalleryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            // $filename = time() . '_' . $file->getClientOriginalName();
            // $path = $file->store('product-galleries', $filename, 'public');
            $path = $file->store('product-galleries', 'public');
            $validated['file_path'] = $path;
        }
        
        unset($validated['file']);
        
        ProductGallery::create($validated);

        return redirect()->route('product-galleries.index')
            ->with('success', 'Galeri produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductGallery $productGallery): Response
    {
        $productGallery->load('product');

        return Inertia::render('product-galleries/show', [
            'gallery' => $productGallery,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProductGallery $productGallery): Response
    {
        $products = Product::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('product-galleries/edit', [
            'gallery' => $productGallery,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductGalleryRequest $request, ProductGallery $productGallery): RedirectResponse
    {
        $validated = $request->validated();
        
        // Handle file upload if new file is provided
        if ($request->hasFile('file')) {
            // Delete old file if exists
            if ($productGallery->file_path && \Storage::disk('public')->exists($productGallery->file_path)) {
                \Storage::disk('public')->delete($productGallery->file_path);
            }
            
            $file = $request->file('file');
            // $filename = time() . '_' . $file->getClientOriginalName();
            // $path = $file->store('product-galleries', $filename, 'public');
            $path = $file->store('product-galleries', 'public');

            $validated['file_path'] = $path;
        }
        
        unset($validated['file']);
        
        $productGallery->update($validated);

        return redirect()->route('product-galleries.index')
            ->with('success', 'Galeri produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductGallery $productGallery): RedirectResponse
    {
        // Delete file if exists
        if ($productGallery->file_path && \Storage::disk('public')->exists($productGallery->file_path)) {
            \Storage::disk('public')->delete($productGallery->file_path);
        }
        
        $productGallery->delete();

        return redirect()->route('product-galleries.index')
            ->with('success', 'Galeri produk berhasil dihapus.');
    }
}
