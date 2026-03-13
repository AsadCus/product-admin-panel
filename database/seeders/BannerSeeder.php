<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Supplier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class BannerSeeder extends Seeder
{
    /**
     * Seed banner records using images in public/seeder/banners.
     */
    public function run(): void
    {
        Banner::truncate();

        Storage::disk('public')->makeDirectory('banners');

        $sourceDirectory = public_path('seeder/banners');

        if (! File::isDirectory($sourceDirectory)) {
            $this->command?->warn('Seeder source directory not found: public/seeder/banners');

            return;
        }

        $sourceFiles = collect(File::files($sourceDirectory));

        if ($sourceFiles->isEmpty()) {
            $this->command?->warn('No images found in public/seeder/banners');

            return;
        }

        $suppliers = Supplier::query()->orderBy('id')->get(['id', 'name']);

        if ($suppliers->isEmpty()) {
            $this->command?->warn('No suppliers found. Please run supplier/category seeders first.');

            return;
        }

        $orderBySupplier = [];

        foreach ($sourceFiles->values() as $index => $file) {
            $supplier = $suppliers[$index % $suppliers->count()];
            $order = ($orderBySupplier[$supplier->id] ?? 0) + 1;
            $orderBySupplier[$supplier->id] = $order;

            $filename = $file->getFilename();
            $destinationPath = 'banners/'.$filename;
            Storage::disk('public')->put($destinationPath, File::get($file->getRealPath()));

            Banner::create([
                'title' => 'Banner '.$supplier->name.' '.$order,
                'description' => 'Seeded banner image for '.$supplier->name,
                'image_path' => $destinationPath,
                'supplier_id' => $supplier->id,
                'is_active' => true,
                'order' => $order,
            ]);
        }
    }
}
