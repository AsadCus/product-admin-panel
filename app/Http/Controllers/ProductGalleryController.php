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
            ->with('product')
            ->orderBy('order')
            ->paginate(10);

        return Inertia::render('ProductGalleries/Index', [
            'galleries' => $galleries,
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

        return Inertia::render('ProductGalleries/Create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductGalleryRequest $request): RedirectResponse
    {
        ProductGallery::create($request->validated());

        return redirect()->route('product-galleries.index')
            ->with('success', 'Galeri produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ProductGallery $productGallery): Response
    {
        $productGallery->load('product');

        return Inertia::render('ProductGalleries/Show', [
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

        return Inertia::render('ProductGalleries/Edit', [
            'gallery' => $productGallery,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductGalleryRequest $request, ProductGallery $productGallery): RedirectResponse
    {
        $productGallery->update($request->validated());

        return redirect()->route('product-galleries.index')
            ->with('success', 'Galeri produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProductGallery $productGallery): RedirectResponse
    {
        $productGallery->delete();

        return redirect()->route('product-galleries.index')
            ->with('success', 'Galeri produk berhasil dihapus.');
    }
}
