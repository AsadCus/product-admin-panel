<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductSpecification;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProductSpecificationSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure storage directory exists
        Storage::disk('public')->makeDirectory('product-specifications');

        // Create sample specification images if they don't exist
        $this->createSampleImages();

        $products = Product::all();

        $specTemplates = [
            [
                'label' => 'Berat',
                'values' => ['500 gram', '1 kg', '1.5 kg', '2 kg', '2.5 kg', '3 kg'],
                'image' => 'weight.svg',
            ],
            [
                'label' => 'Dimensi',
                'values' => ['20x15x10 cm', '30x20x15 cm', '40x30x20 cm', '50x40x30 cm'],
                'image' => 'dimensions.svg',
            ],
            [
                'label' => 'Material',
                'values' => ['Stainless Steel', 'Plastic', 'Wood', 'Aluminum', 'Glass', 'Ceramic'],
                'image' => 'material.svg',
            ],
            [
                'label' => 'Warna',
                'values' => ['Hitam', 'Putih', 'Silver', 'Biru', 'Merah', 'Hijau', 'Kuning'],
                'image' => 'color.svg',
            ],
            [
                'label' => 'Daya',
                'values' => ['100 Watt', '150 Watt', '200 Watt', '300 Watt', '500 Watt'],
                'image' => 'power.svg',
            ],
            [
                'label' => 'Garansi',
                'values' => ['6 Bulan', '1 Tahun', '2 Tahun', '3 Tahun', '5 Tahun'],
                'image' => 'warranty.svg',
            ],
            [
                'label' => 'Kapasitas',
                'values' => ['500 ml', '1 Liter', '2 Liter', '5 Liter', '10 Liter'],
                'image' => 'capacity.svg',
            ],
            [
                'label' => 'Voltase',
                'values' => ['110V', '220V', '240V', '12V DC', '24V DC'],
                'image' => 'voltage.svg',
            ],
        ];

        foreach ($products as $product) {
            // Add 3-5 specifications per product
            $specCount = rand(3, 5);
            $selectedTemplates = collect($specTemplates)->random($specCount);

            foreach ($selectedTemplates as $index => $template) {
                // Copy image from public to storage
                $imagePath = null;
                $publicImagePath = public_path('images/specifications/'.$template['image']);

                if (File::exists($publicImagePath)) {
                    $storagePath = 'product-specifications/'.$template['image'];
                    Storage::disk('public')->put(
                        $storagePath,
                        File::get($publicImagePath)
                    );
                    $imagePath = $storagePath;
                }

                ProductSpecification::create([
                    'product_id' => $product->id,
                    'label' => $template['label'],
                    'value' => collect($template['values'])->random(),
                    'image_path' => $imagePath,
                    'order' => $index + 1,
                ]);
            }
        }
    }

    private function createSampleImages(): void
    {
        $images = [
            'weight.svg' => $this->createPlaceholderSVG('⚖️', '#3b82f6'),
            'dimensions.svg' => $this->createPlaceholderSVG('📏', '#8b5cf6'),
            'material.svg' => $this->createPlaceholderSVG('🔨', '#10b981'),
            'color.svg' => $this->createPlaceholderSVG('🎨', '#f59e0b'),
            'power.svg' => $this->createPlaceholderSVG('⚡', '#eab308'),
            'warranty.svg' => $this->createPlaceholderSVG('🛡️', '#06b6d4'),
            'capacity.svg' => $this->createPlaceholderSVG('📦', '#ec4899'),
            'voltage.svg' => $this->createPlaceholderSVG('🔌', '#ef4444'),
        ];

        foreach ($images as $filename => $svg) {
            $path = public_path('images/specifications/'.$filename);
            if (! File::exists($path)) {
                File::put($path, $svg);
            }
        }
    }

    private function createPlaceholderSVG(string $emoji, string $color): string
    {
        return <<<SVG
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="{$color}" opacity="0.1"/>
  <text x="50%" y="50%" font-size="80" text-anchor="middle" dominant-baseline="middle">{$emoji}</text>
</svg>
SVG;
    }
}
