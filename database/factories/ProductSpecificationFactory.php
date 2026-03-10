<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductSpecification>
 */
class ProductSpecificationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'label' => fake()->randomElement(['Weight', 'Dimensions', 'Material', 'Color', 'Power']),
            'value' => fake()->randomElement(['2.5 kg', '30x20x10 cm', 'Stainless Steel', 'Black', '220V']),
            'image_path' => null,
            'order' => fake()->numberBetween(1, 10),
        ];
    }
}
