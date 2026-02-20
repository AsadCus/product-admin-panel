<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductGalleryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'image', 'max:2048'], // max 2MB
            'product_id' => ['required', 'exists:products,id'],
            'order' => [
                'required',
                'integer',
                'min:1',
                function ($attribute, $value, $fail) {
                    $exists = \App\Models\ProductGallery::where('product_id', $this->product_id)
                        ->where('order', $value)
                        ->exists();

                    if ($exists) {
                        $fail('Order '.$value.' sudah digunakan untuk produk ini. Silakan pilih order yang berbeda.');
                    }
                },
            ],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'File gambar wajib diupload.',
            'file.file' => 'File harus berupa file yang valid.',
            'file.image' => 'File harus berupa gambar (jpg, jpeg, png, gif, svg).',
            'file.max' => 'Ukuran file maksimal 2MB.',
            'product_id.required' => 'Produk wajib dipilih.',
            'product_id.exists' => 'Produk tidak ditemukan.',
            'order.required' => 'Order wajib diisi.',
            'order.integer' => 'Order harus berupa angka.',
            'order.min' => 'Order minimal 1.',
        ];
    }
}
