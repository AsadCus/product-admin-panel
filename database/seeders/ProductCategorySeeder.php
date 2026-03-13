<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    public function run(): void
    {
        // Audioinfinite Supplier
        $Audioinfinite = Supplier::create([
            'name' => 'Audioinfinite',
            'desc' => 'Premium audio equipment and accessories supplier',
        ]);

        // Audioinfinite Categories
        $headphonesCategory = ProductCategory::create([
            'name' => 'Headphones',
            'description' => 'High-quality headphones and earphones',
            'supplier_id' => $Audioinfinite->id,
        ]);

        $speakersCategory = ProductCategory::create([
            'name' => 'Speakers',
            'description' => 'Professional speakers and sound systems',
            'supplier_id' => $Audioinfinite->id,
        ]);

        // Products for Headphones Category
        $product1 = Product::create([
            'name' => 'Wireless Headphones Pro',
            'description' => 'Premium wireless headphones with noise cancellation',
            'supplier_id' => $Audioinfinite->id,
            'category_id' => $headphonesCategory->id,
        ]);

        $product2 = Product::create([
            'name' => 'Gaming Headset RGB',
            'description' => 'Gaming headset with RGB lighting and surround sound',
            'supplier_id' => $Audioinfinite->id,
            'category_id' => $headphonesCategory->id,
        ]);

        // Products for Speakers Category
        $product3 = Product::create([
            'name' => 'Bluetooth Speaker Mini',
            'description' => 'Portable bluetooth speaker with powerful bass',
            'supplier_id' => $Audioinfinite->id,
            'category_id' => $speakersCategory->id,
        ]);

        // Tendzone Supplier
        $Tendzone = Supplier::create([
            'name' => 'Tendzone',
            'desc' => 'Outdoor and camping equipment specialist',
        ]);

        // Tendzone Categories
        $tentsCategory = ProductCategory::create([
            'name' => 'Tents',
            'description' => 'Camping tents for all weather conditions',
            'supplier_id' => $Tendzone->id,
        ]);

        $backpacksCategory = ProductCategory::create([
            'name' => 'Backpacks',
            'description' => 'Durable backpacks for outdoor adventures',
            'supplier_id' => $Tendzone->id,
        ]);

        // Products for Tents Category
        $product4 = Product::create([
            'name' => 'Family Tent 6 Person',
            'description' => 'Spacious tent for family camping trips',
            'supplier_id' => $Tendzone->id,
            'category_id' => $tentsCategory->id,
        ]);

        $product5 = Product::create([
            'name' => 'Ultralight Tent Solo',
            'description' => 'Lightweight tent perfect for solo hikers',
            'supplier_id' => $Tendzone->id,
            'category_id' => $tentsCategory->id,
        ]);

        // Products for Backpacks Category
        $product6 = Product::create([
            'name' => 'Hiking Backpack 50L',
            'description' => 'Large capacity backpack with ergonomic design',
            'supplier_id' => $Tendzone->id,
            'category_id' => $backpacksCategory->id,
        ]);
    }
}
