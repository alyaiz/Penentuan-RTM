<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Rtm;
use App\Models\Criteria;

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
        $admins = User::count();
        $rtms = Rtm::withAllCriteria()->get();
        $kk = $rtms->count();

        $w = $this->weights();
        $threshold = class_exists(\App\Models\Setting::class)
            ? (float) \App\Models\Setting::get('sawwp_threshold', config('sawwp.threshold', 0.5))
            : (float) config('sawwp.threshold', 0.5);

        $wpProducts = [];
        $scales = [];
        foreach ($rtms as $r) {
            $s = [
                'penghasilan' => (float) ($r->penghasilanCriteria->scale ?? 0),
                'pengeluaran' => (float) ($r->pengeluaranCriteria->scale ?? 0),
                'tempat_tinggal' => (float) ($r->tempatTinggalCriteria->scale ?? 0),
                'status_kepemilikan_rumah' => (float) ($r->statusKepemilikanRumahCriteria->scale ?? 0),
                'kondisi_rumah' => (float) ($r->kondisiRumahCriteria->scale ?? 0),
                'aset_yang_dimiliki' => (float) ($r->asetYangDimilikiCriteria->scale ?? 0),
                'transportasi' => (float) ($r->transportasiCriteria->scale ?? 0),
                'penerangan_rumah' => (float) ($r->peneranganRumahCriteria->scale ?? 0),
            ];
            $scales[] = $s;

            $wpRaw = 1.0;
            foreach ($s as $k => $v) $wpRaw *= pow($v > 0 ? $v : 0.0001, ($w[$k] ?? 0.0));
            $wpProducts[] = $wpRaw;
        }

        $sumWp = array_sum($wpProducts) ?: 1.0;
        $kkMiskin = 0;

        foreach ($scales as $s) {
            $saw = 0.0;
            foreach ($s as $k => $v) $saw += $v * ($w[$k] ?? 0.0);

            $wpRaw = 1.0;
            foreach ($s as $k => $v) $wpRaw *= pow($v > 0 ? $v : 0.0001, ($w[$k] ?? 0.0));
            $wp = $wpRaw / $sumWp;

            if ($saw >= $threshold || $wp >= $threshold) $kkMiskin++;
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'admins' => $admins,
                'kk' => $kk,
                'kk_miskin' => $kkMiskin,
            ],
        ]);
    }
}
