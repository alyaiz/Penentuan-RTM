<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class CalculateUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'threshold' => 'required|numeric|min:0|max:1',
            'mcr_delta' => 'required|numeric|min:0|max:0.5',
            'threshold_saw' => 'required|numeric|min:0|max:1',
            'threshold_wp' => 'required|numeric|min:0|max:1',
        ];
    }

    // public function messages(): array
    // {
    //     return [
    //         'threshold.required' => 'Threshold harus diisi.',
    //         'threshold.numeric' => 'Threshold harus berupa angka.',
    //         'threshold.min' => 'Threshold minimal 0.',
    //         'threshold.max' => 'Threshold maksimal 1.',

    //         'mcr_delta.required' => 'Delta MCR harus diisi.',
    //         'mcr_delta.numeric' => 'Delta MCR harus berupa angka.',
    //         'mcr_delta.min' => 'Delta MCR minimal 0.',
    //         'mcr_delta.max' => 'Delta MCR maksimal 0.5.',

    //         'threshold_saw.required' => 'Threshold SAW harus diisi.',
    //         'threshold_saw.numeric' => 'Threshold SAW harus berupa angka.',
    //         'threshold_saw.min' => 'Threshold SAW minimal 0.',
    //         'threshold_saw.max' => 'Threshold SAW maksimal 1.',

    //         'threshold_wp.required' => 'Threshold WP harus diisi.',
    //         'threshold_wp.numeric' => 'Threshold WP harus berupa angka.',
    //         'threshold_wp.min' => 'Threshold WP minimal 0.',
    //         'threshold_wp.max' => 'Threshold WP maksimal 1.',
    //     ];
    // }
}
