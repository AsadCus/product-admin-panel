<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Models\Banner;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::with('supplier')->orderBy('supplier_id')->orderBy('order')->get();
        return Inertia::render('banners/index', ['banners' => ['data' => $banners]]);
    }

    public function create(): Response
    {
        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);
        return Inertia::render('banners/create', ['suppliers' => $suppliers]);
    }

    public function store(StoreBannerRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }
        
        unset($validated['image']);
        Banner::create($validated);

        return redirect()->route('banners.index');
    }

    public function show(Banner $banner): Response
    {
        $banner->load('supplier');
        return Inertia::render('banners/show', ['banner' => $banner]);
    }

    public function edit(Banner $banner): Response
    {
        $suppliers = Supplier::orderBy('name')->get(['id', 'name']);
        return Inertia::render('banners/edit', ['banner' => $banner, 'suppliers' => $suppliers]);
    }

    public function update(UpdateBannerRequest $request, Banner $banner): RedirectResponse
    {
        $validated = $request->validated();
        
        if ($request->hasFile('image')) {
            if ($banner->image_path && \Storage::disk('public')->exists($banner->image_path)) {
                \Storage::disk('public')->delete($banner->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('banners', 'public');
        }
        
        unset($validated['image']);
        $banner->update($validated);

        return redirect()->route('banners.index');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        if ($banner->image_path && \Storage::disk('public')->exists($banner->image_path)) {
            \Storage::disk('public')->delete($banner->image_path);
        }
        
        $banner->delete();
        return redirect()->route('banners.index');
    }

    public function reorderBanners(\Illuminate\Http\Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'banners' => 'required|array',
            'banners.*.id' => 'required|exists:banners,id',
            'banners.*.order' => 'required|integer|min:1',
        ]);

        // Update order hanya untuk banner dengan supplier_id yang sama
        foreach ($validated['banners'] as $bannerData) {
            Banner::where('id', $bannerData['id'])
                ->where('supplier_id', $validated['supplier_id'])
                ->update(['order' => $bannerData['order']]);
        }

        return back();
    }
}
