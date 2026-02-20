<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $products = Product::query()
            ->with(['supplier', 'galleries'])
            ->latest()
            ->paginate(10);

        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $suppliers = Supplier::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('products/create', [
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::create($request->validated());

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): Response
    {
        $product->load(['supplier', 'galleries']);

        return Inertia::render('products/show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'supplier' => [
                    'id' => $product->supplier->id,
                    'name' => $product->supplier->name,
                    'desc' => $product->supplier->desc,
                ],
                'galleries' => $product->galleries->map(function ($gallery) {
                    return [
                        'id' => $gallery->id,
                        'file_path' => $gallery->file_path,
                        'file_url' => $gallery->file_path ? asset('storage/'.$gallery->file_path) : null,
                        'order' => $gallery->order,
                    ];
                }),
                'created_at' => $product->created_at->toISOString(),
                'updated_at' => $product->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        $suppliers = Supplier::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('products/edit', [
            'product' => $product,
            'suppliers' => $suppliers,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }

    /**
     * Reorder product galleries.
     */
    public function reorderGalleries(Product $product): RedirectResponse
    {
        $galleries = request()->validate([
            'galleries' => 'required|array',
            'galleries.*.id' => 'required|exists:product_galleries,id',
            'galleries.*.order' => 'required|integer|min:1',
        ])['galleries'];

        foreach ($galleries as $gallery) {
            \App\Models\ProductGallery::where('id', $gallery['id'])
                ->update(['order' => $gallery['order']]);
        }

        return back();
    }
}
