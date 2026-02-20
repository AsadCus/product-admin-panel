<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBannerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['required', 'file', 'image', 'max:2048'],
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'is_active' => ['boolean'],
            'order' => [
                'required',
                'integer',
                'min:1',
                \Illuminate\Validation\Rule::unique('banners')->where(function ($query) {
                    return $query->where('supplier_id', $this->supplier_id);
                }),
            ],
        ];
    }
}
