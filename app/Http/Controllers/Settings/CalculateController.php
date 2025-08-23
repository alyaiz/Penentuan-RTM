<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CalculateController extends Controller
{
  public function edit(): Response
  {
    $settings = Setting::whereIn('key', ['mcr_delta', 'threshold_saw', 'threshold_wp'])->pluck('value', 'key');

    return Inertia::render('settings/calculate', [
      'mcr_delta' => (float) ($settings['mcr_delta'] ?? 0.05),
      'threshold_saw' => (float) ($settings['threshold_saw'] ?? 0.5),
      'threshold_wp' => (float) ($settings['threshold_wp'] ?? 0.5),
    ]);
  }

  public function update(Request $request): RedirectResponse
  {
    $validated = $request->validate([
      'mcr_delta' => 'required|numeric|min:0|max:1',
      'threshold_saw' => 'required|numeric|min:0|max:1',
      'threshold_wp' => 'required|numeric|min:0|max:1',
    ]);

    foreach ($validated as $key => $value) {
      Setting::updateOrInsert(
        ['key' => $key],
        [
          'value' => $value,
          'updated_at' => now(),
          'created_at' => DB::raw('COALESCE(created_at, NOW())'),
        ]
      );
    }

    return to_route('calculate.edit');
  }
}
