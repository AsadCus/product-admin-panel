<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'supplier_id' => $this->supplier_id,
            'category_id' => $this->category_id,
            'supplier' => new SupplierResource($this->whenLoaded('supplier')),
            'category' => $this->whenLoaded('category', function () {
                return $this->category ? [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'description' => $this->category->description,
                ] : null;
            }),
            'galleries' => ProductGalleryResource::collection($this->whenLoaded('galleries')),
            'galleries_count' => $this->whenCounted('galleries'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
