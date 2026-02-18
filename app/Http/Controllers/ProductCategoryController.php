<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductCategoryController extends Controller
{
    public function index(): Response
    {
        $categories = ProductCategory::query()
            ->with('supplier')
            ->withCount('products')
            ->latest()
            ->get();

        return Inertia::render('product-categories/index', [
            'categories' => $categories,
        ]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('product-categories/create', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_id' => 'required|exists:suppliers,id',
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'supplier_id.required' => 'Supplier wajib dipilih.',
            'supplier_id.exists' => 'Supplier tidak valid.',
        ]);

        ProductCategory::create($validated);

        return redirect()->route('product-categories.index')
            ->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function show(ProductCategory $productCategory): Response
    {
        $productCategory->load(['supplier', 'products']);

        return Inertia::render('product-categories/show', [
            'category' => $productCategory,
        ]);
    }

    public function edit(ProductCategory $productCategory): Response
    {
        $suppliers = Supplier::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('product-categories/edit', [
            'category' => $productCategory,
            'suppliers' => $suppliers,
        ]);
    }

    public function update(Request $request, ProductCategory $productCategory): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_id' => 'required|exists:suppliers,id',
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'supplier_id.required' => 'Supplier wajib dipilih.',
            'supplier_id.exists' => 'Supplier tidak valid.',
        ]);

        $productCategory->update($validated);

        return redirect()->route('product-categories.index')
            ->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(ProductCategory $productCategory): RedirectResponse
    {
        $productCategory->delete();

        return redirect()->route('product-categories.index')
            ->with('success', 'Kategori berhasil dihapus.');
    }
}
