<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Rtm;
use App\Models\Criteria;
use App\Models\Setting;

class DashboardController extends Controller
{
    private function weights(): array
    {
        $raw = Criteria::all()->groupBy('type')->map(fn($g) => (float) optional($g->first())->weight ?? 0.0)->toArray();
        $sum = array_sum($raw) ?: 1.0;
        $w = [];
        foreach ($raw as $k => $v) $w[$k] = $v / $sum;
        return $w;
    }

    public function index()
    {
        $userCount = User::count();
        $rtmCount = Rtm::count();
        
        $settings = Setting::whereIn('key', ['threshold_saw', 'threshold_wp'])->pluck('value', 'key');

        $thresholdSaw = (float) ($settings['threshold_saw'] ?? 0);
        $rtmPoorSawCount = Rtm::whereHas('saw', function ($q) use ($thresholdSaw) {
            $q->where('score', '<', $thresholdSaw);
        })->count();

        $thresholdWp = (float) ($settings['threshold_wp'] ?? 0);
        $rtmPoorWpCount = Rtm::whereHas('wp', function ($q) use ($thresholdWp) {
            $q->where('score', '<', $thresholdWp);
        })->count();


        return Inertia::render('dashboard', [
            'stats' => [
                'user' => $userCount,
                'kk' => $rtmCount,
                'kk_miskin_saw' => $rtmPoorSawCount,
                'kk_miskin_wp' => $rtmPoorWpCount,
            ],
        ]);
    }
}
