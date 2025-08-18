<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('pengaturan', [
            'threshold' => Setting::get('sawwp_threshold', config('sawwp.threshold', 0.5)),
            'mcr_delta' => Setting::get('sawwp_mcr_delta', config('sawwp.mcr_delta', 0.05)),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'threshold' => ['required','numeric','between:0,1'],
            'mcr_delta' => ['required','numeric','min:0','max:0.5'],
        ], [
            'threshold.between' => 'Ambang harus di antara 0 dan 1.',
            'mcr_delta.max'     => 'Delta MCR maks 0.5 (50%).',
        ]);

        Setting::set('sawwp_threshold', $data['threshold']);
        Setting::set('sawwp_mcr_delta', $data['mcr_delta']);

        return back()->with('success', 'Pengaturan tersimpan.');
    }
}
