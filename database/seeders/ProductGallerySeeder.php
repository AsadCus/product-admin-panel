<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductGallery;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProductGallerySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductGallery::truncate();

        Storage::disk('public')->makeDirectory('product-galleries');

        $sourceDirectory = public_path('seeder/product-galleries');

        if (! File::isDirectory($sourceDirectory)) {
            $this->command?->warn('Seeder source directory not found: public/seeder/product-galleries');

            return;
        }

        $sourceFiles = collect(File::files($sourceDirectory));

        if ($sourceFiles->isEmpty()) {
            $this->command?->warn('No images found in public/seeder/product-galleries');

            return;
        }

        $storagePaths = $sourceFiles
            ->map(function ($file): string {
                $filename = $file->getFilename();
                $destinationPath = 'product-galleries/'.$filename;

                Storage::disk('public')->put($destinationPath, File::get($file->getRealPath()));

                return $destinationPath;
            })
            ->values();

        $products = Product::all();

        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please run ProductSeeder first.');

            return;
        }

        foreach ($products as $product) {
            $galleryCount = min(random_int(2, 3), $storagePaths->count());
            $selectedPaths = $storagePaths->shuffle()->take($galleryCount)->values();

            foreach ($selectedPaths as $index => $filePath) {
                ProductGallery::create([
                    'file_path' => $filePath,
                    'product_id' => $product->id,
                    'order' => $index + 1,
                ]);
            }
        }

        $this->command->info('Product galleries seeded successfully!');
    }
}
