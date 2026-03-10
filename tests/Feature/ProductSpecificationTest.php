<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductSpecification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductSpecificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_users_can_create_product_specification(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $product = Product::factory()->create();

        $specData = [
            'product_id' => $product->id,
            'label' => 'Weight',
            'value' => '2.5 kg',
            'order' => 1,
        ];

        $response = $this->post(route('product-specifications.store'), $specData);
        $response->assertRedirect();

        $this->assertDatabaseHas('product_specifications', [
            'product_id' => $product->id,
            'label' => 'Weight',
            'value' => '2.5 kg',
            'order' => 1,
        ]);
    }

    public function test_specification_label_is_required(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $product = Product::factory()->create();

        $response = $this->post(route('product-specifications.store'), [
            'product_id' => $product->id,
            'value' => '2.5 kg',
            'order' => 1,
        ]);

        $response->assertSessionHasErrors('label');
    }

    public function test_specification_value_is_required(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $product = Product::factory()->create();

        $response = $this->post(route('product-specifications.store'), [
            'product_id' => $product->id,
            'label' => 'Weight',
            'order' => 1,
        ]);

        $response->assertSessionHasErrors('value');
    }

    public function test_authenticated_users_can_update_product_specification(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $spec = ProductSpecification::factory()->create([
            'label' => 'Weight',
            'value' => '2.5 kg',
        ]);

        $updatedData = [
            'label' => 'Weight',
            'value' => '3.0 kg',
            'order' => 1,
        ];

        $response = $this->put(route('product-specifications.update', $spec), $updatedData);
        $response->assertRedirect();

        $this->assertDatabaseHas('product_specifications', [
            'id' => $spec->id,
            'value' => '3.0 kg',
        ]);
    }

    public function test_authenticated_users_can_delete_product_specification(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $spec = ProductSpecification::factory()->create();

        $response = $this->delete(route('product-specifications.destroy', $spec));
        $response->assertRedirect();

        $this->assertDatabaseMissing('product_specifications', ['id' => $spec->id]);
    }

    public function test_product_specifications_are_ordered_correctly(): void
    {
        $product = Product::factory()->create();

        ProductSpecification::factory()->create(['product_id' => $product->id, 'order' => 3]);
        ProductSpecification::factory()->create(['product_id' => $product->id, 'order' => 1]);
        ProductSpecification::factory()->create(['product_id' => $product->id, 'order' => 2]);

        $specifications = $product->specifications;

        $this->assertEquals(1, $specifications[0]->order);
        $this->assertEquals(2, $specifications[1]->order);
        $this->assertEquals(3, $specifications[2]->order);
    }

    public function test_specifications_are_deleted_when_product_is_deleted(): void
    {
        $product = Product::factory()->create();
        $spec = ProductSpecification::factory()->create(['product_id' => $product->id]);

        $product->delete();

        $this->assertDatabaseMissing('product_specifications', ['id' => $spec->id]);
    }
}
