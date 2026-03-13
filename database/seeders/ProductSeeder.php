<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ProductCategory::query()->get(['id', 'supplier_id']);

        if ($categories->isEmpty()) {
            $this->command?->warn('No product categories found. Please run ProductCategorySeeder first.');

            return;
        }

        for ($index = 0; $index < 20; $index++) {
            $category = $categories->random();

            Product::factory()->create([
                'supplier_id' => $category->supplier_id,
                'category_id' => $category->id,
            ]);
        }
    }
}
