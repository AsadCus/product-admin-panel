<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductSpecificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:255'],
            'image' => ['nullable', 'file', 'image', 'max:1024'],
            'order' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'label.required' => 'Label wajib diisi.',
            'label.max' => 'Label maksimal 255 karakter.',
            'value.required' => 'Nilai wajib diisi.',
            'value.max' => 'Nilai maksimal 255 karakter.',
            'image.file' => 'File harus berupa file yang valid.',
            'image.image' => 'File harus berupa gambar (jpg, jpeg, png, gif, svg).',
            'image.max' => 'Ukuran gambar maksimal 1MB.',
            'order.required' => 'Order wajib diisi.',
            'order.integer' => 'Order harus berupa angka.',
            'order.min' => 'Order minimal 1.',
        ];
    }
}
