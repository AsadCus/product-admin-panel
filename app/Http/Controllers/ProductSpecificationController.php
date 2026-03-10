<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductSpecificationRequest;
use App\Http\Requests\UpdateProductSpecificationRequest;
use App\Models\ProductSpecification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class ProductSpecificationController extends Controller
{
    public function store(StoreProductSpecificationRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('product-specifications', 'public');
        }

        ProductSpecification::create($data);

        return back()->with('success', 'Spesifikasi berhasil ditambahkan.');
    }

    public function update(UpdateProductSpecificationRequest $request, ProductSpecification $productSpecification): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($productSpecification->image_path) {
                Storage::disk('public')->delete($productSpecification->image_path);
            }
            $data['image_path'] = $request->file('image')->store('product-specifications', 'public');
        }

        $productSpecification->update($data);

        return back()->with('success', 'Spesifikasi berhasil diperbarui.');
    }

    public function destroy(ProductSpecification $productSpecification): RedirectResponse
    {
        if ($productSpecification->image_path) {
            Storage::disk('public')->delete($productSpecification->image_path);
        }

        $productSpecification->delete();

        return back()->with('success', 'Spesifikasi berhasil dihapus.');
    }

    public function reorder(): RedirectResponse
    {
        $specifications = request()->validate([
            'specifications' => 'required|array',
            'specifications.*.id' => 'required|exists:product_specifications,id',
            'specifications.*.order' => 'required|integer|min:1',
        ])['specifications'];

        foreach ($specifications as $spec) {
            ProductSpecification::where('id', $spec['id'])
                ->update(['order' => $spec['order']]);
        }

        return back();
    }
}
