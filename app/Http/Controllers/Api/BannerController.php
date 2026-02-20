<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     * Optional: filter by supplier_id
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Banner::query()->with('supplier');

        // Filter by supplier if provided
        if ($request->has('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Filter by active status if provided
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $banners = $query->orderBy('supplier_id')
            ->orderBy('order')
            ->get();

        return BannerResource::collection($banners);
    }

    /**
     * Display the specified resource.
     */
    public function show(Banner $banner): BannerResource
    {
        $banner->load('supplier');

        return new BannerResource($banner);
    }

    /**
     * Get banners by supplier ID
     */
    public function bySupplier(int $supplierId): AnonymousResourceCollection
    {
        $banners = Banner::query()
            ->with('supplier')
            ->where('supplier_id', $supplierId)
            ->where('is_active', true)
            ->orderBy('order')
            ->get();

        return BannerResource::collection($banners);
    }

    /**
     * Get active banners only
     */
    public function active(): AnonymousResourceCollection
    {
        $banners = Banner::query()
            ->with('supplier')
            ->where('is_active', true)
            ->orderBy('supplier_id')
            ->orderBy('order')
            ->get();

        return BannerResource::collection($banners);
    }
}
