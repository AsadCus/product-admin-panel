<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductGallery;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        // AudioInfinite Supplier
        $audioInfinite = Supplier::create([
            'name' => 'AudioInfinite',
            'desc' => 'Premium audio equipment and accessories supplier',
        ]);

        // AudioInfinite Categories
        $headphonesCategory = ProductCategory::create([
            'name' => 'Headphones',
            'description' => 'High-quality headphones and earphones',
            'supplier_id' => $audioInfinite->id,
        ]);

        $speakersCategory = ProductCategory::create([
            'name' => 'Speakers',
            'description' => 'Professional speakers and sound systems',
            'supplier_id' => $audioInfinite->id,
        ]);

        // Products for Headphones Category
        $product1 = Product::create([
            'name' => 'Wireless Headphones Pro',
            'description' => 'Premium wireless headphones with noise cancellation',
            'supplier_id' => $audioInfinite->id,
            'category_id' => $headphonesCategory->id,
        ]);

        ProductGallery::create([
            'file_path' => 'products/headphones-pro-1.jpg',
            'product_id' => $product1->id,
            'order' => 1,
        ]);

        $product2 = Product::create([
            'name' => 'Gaming Headset RGB',
            'description' => 'Gaming headset with RGB lighting and surround sound',
            'supplier_id' => $audioInfinite->id,
            'category_id' => $headphonesCategory->id,
        ]);

        ProductGallery::create([
            'file_path' => 'products/gaming-headset-1.jpg',
            'product_id' => $product2->id,
            'order' => 1,
        ]);

        // Products for Speakers Category
        $product3 = Product::create([
            'name' => 'Bluetooth Speaker Mini',
            'description' => 'Portable bluetooth speaker with powerful bass',
            'supplier_id' => $audioInfinite->id,
            'category_id' => $speakersCategory->id,
        ]);

        ProductGallery::create([
            'file_path' => 'products/speaker-mini-1.jpg',
            'product_id' => $product3->id,
            'order' => 1,
        ]);

        // TendZone Supplier
        $tendZone = Supplier::create([
            'name' => 'TendZone',
            'desc' => 'Outdoor and camping equipment specialist',
        ]);

        // TendZone Categories
        $tentsCategory = ProductCategory::create([
            'name' => 'Tents',
            'description' => 'Camping tents for all weather conditions',
            'supplier_id' => $tendZone->id,
        ]);

        $backpacksCategory = ProductCategory::create([
            'name' => 'Backpacks',
            'description' => 'Durable backpacks for outdoor adventures',
            'supplier_id' => $tendZone->id,
        ]);

        // Products for Tents Category
        $product4 = Product::create([
            'name' => 'Family Tent 6 Person',
            'description' => 'Spacious tent for family camping trips',
            'supplier_id' => $tendZone->id,
            'category_id' => $tentsCategory->id,
        ]);

        ProductGallery::create([
            'file_path' => 'products/family-tent-1.jpg',
            'product_id' => $product4->id,
            'order' => 1,
        ]);

        $product5 = Product::create([
            'name' => 'Ultralight Tent Solo',
            'description' => 'Lightweight tent perfect for solo hikers',
            'supplier_id' => $tendZone->id,
            'category_id' => $tentsCategory->id,
        ]);

        ProductGallery::create([
            'file_path' => 'products/ultralight-tent-1.jpg',
            'product_id' => $product5->id,
            'order' => 1,
        ]);

        // Products for Backpacks Category
        $product6 = Product::create([
            'name' => 'Hiking Backpack 50L',
            'description' => 'Large capacity backpack with ergonomic design',
            'supplier_id' => $tendZone->id,
            'category_id' => $backpacksCategory->id,
        ]);

        ProductGallery::create([
            'file_path' => 'products/hiking-backpack-1.jpg',
            'product_id' => $product6->id,
            'order' => 1,
        ]);
    }
}
