<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductGallery;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductGalleryTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_product_galleries_index(): void
    {
        $response = $this->get(route('product-galleries.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_product_galleries_index(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('product-galleries.index'));
        $response->assertOk();
    }

    public function test_authenticated_users_can_create_product_gallery(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $product = Product::factory()->create();

        $galleryData = [
            'file_path' => 'images/test.jpg',
            'product_id' => $product->id,
            'order' => 1,
        ];

        $response = $this->post(route('product-galleries.store'), $galleryData);
        $response->assertRedirect(route('product-galleries.index'));

        $this->assertDatabaseHas('product_galleries', $galleryData);
    }

    public function test_product_gallery_file_path_is_required(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $product = Product::factory()->create();

        $response = $this->post(route('product-galleries.store'), [
            'product_id' => $product->id,
            'order' => 1,
        ]);

        $response->assertSessionHasErrors('file_path');
    }

    public function test_product_gallery_product_id_is_required(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('product-galleries.store'), [
            'file_path' => 'images/test.jpg',
            'order' => 1,
        ]);

        $response->assertSessionHasErrors('product_id');
    }

    public function test_authenticated_users_can_update_product_gallery(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $gallery = ProductGallery::factory()->create();

        $updatedData = [
            'file_path' => 'images/updated.jpg',
            'product_id' => $gallery->product_id,
            'order' => 5,
        ];

        $response = $this->put(route('product-galleries.update', $gallery), $updatedData);
        $response->assertRedirect(route('product-galleries.index'));

        $this->assertDatabaseHas('product_galleries', $updatedData);
    }

    public function test_authenticated_users_can_delete_product_gallery(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $gallery = ProductGallery::factory()->create();

        $response = $this->delete(route('product-galleries.destroy', $gallery));
        $response->assertRedirect(route('product-galleries.index'));

        $this->assertDatabaseMissing('product_galleries', ['id' => $gallery->id]);
    }

    public function test_product_galleries_are_ordered_correctly(): void
    {
        $product = Product::factory()->create();

        ProductGallery::factory()->create(['product_id' => $product->id, 'order' => 3]);
        ProductGallery::factory()->create(['product_id' => $product->id, 'order' => 1]);
        ProductGallery::factory()->create(['product_id' => $product->id, 'order' => 2]);

        $galleries = $product->galleries;

        $this->assertEquals(1, $galleries[0]->order);
        $this->assertEquals(2, $galleries[1]->order);
        $this->assertEquals(3, $galleries[2]->order);
    }
}
