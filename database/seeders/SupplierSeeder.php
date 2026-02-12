<?php

namespace Database\Seeders;

use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $suppliers = [
            [
                'name' => 'AudioInfinite',
                'desc' => 'Premium audio equipment and accessories supplier',
            ],
            [
                'name' => 'TendZone',
                'desc' => 'Professional electronics and gadgets distributor',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }

        // Create additional random suppliers
        Supplier::factory()->count(8)->create();
    }
}
