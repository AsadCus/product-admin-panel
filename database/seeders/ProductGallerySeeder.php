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
        // Clear existing galleries
        ProductGallery::truncate();

        // Ensure directory exists
        Storage::disk('public')->makeDirectory('product-galleries');

        // Create placeholder image
        $placeholderPath = storage_path('app/public/product-galleries/placeholder.jpg');
        if (! File::exists($placeholderPath)) {
            // Create a simple placeholder image using GD
            $width = 800;
            $height = 600;
            $image = imagecreatetruecolor($width, $height);

            // Set background color (light gray)
            $bgColor = imagecolorallocate($image, 240, 240, 240);
            imagefill($image, 0, 0, $bgColor);

            // Set text color (dark gray)
            $textColor = imagecolorallocate($image, 100, 100, 100);

            // Add text
            $text = 'Product Image';
            $font = 5; // Built-in font
            $textWidth = imagefontwidth($font) * strlen($text);
            $textHeight = imagefontheight($font);
            $x = ($width - $textWidth) / 2;
            $y = ($height - $textHeight) / 2;

            imagestring($image, $font, $x, $y, $text, $textColor);

            // Save image
            imagejpeg($image, $placeholderPath, 90);
            imagedestroy($image);
        }

        // Get all products
        $products = Product::all();

        if ($products->isEmpty()) {
            $this->command->warn('No products found. Please run ProductSeeder first.');

            return;
        }

        // Create galleries for each product
        foreach ($products as $product) {
            // Create 2-3 galleries per product
            $galleryCount = rand(2, 3);

            for ($i = 0; $i < $galleryCount; $i++) {
                ProductGallery::create([
                    'file_path' => 'product-galleries/placeholder.jpg',
                    'product_id' => $product->id,
                    'order' => $i,
                ]);
            }
        }

        $this->command->info('Product galleries seeded successfully!');
    }
}
