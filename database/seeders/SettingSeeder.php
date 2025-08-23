<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
  /**
   * Run the database seeds.
   */
  public function run(): void
  {
    $settings = [
      [
        'key' => 'mcr_delta',
        'value' => '0.05',
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'key' => 'threshold_saw',
        'value' => '0.5',
        'created_at' => now(),
        'updated_at' => now(),
      ],
      [
        'key' => 'threshold_wp',
        'value' => '0.5',
        'created_at' => now(),
        'updated_at' => now(),
      ],
    ];

    foreach ($settings as $setting) {
      Setting::updateOrInsert(
        ['key' => $setting['key']],
        $setting
      );
    }
  }
}
