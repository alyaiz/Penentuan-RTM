<?php

namespace App\Exports;

use App\Models\Criteria;
use App\Models\Rtm;
use Maatwebsite\Excel\Concerns\FromArray;

class HasilExport implements FromArray
{
    public function array(): array
    {
        $weights = Criteria::all()
            ->groupBy('type')
            ->map(fn($g) => (float) optional($g->first())->weight ?? 0.0)
            ->toArray();

        $rtms = Rtm::withAllCriteria()->get();

        $rows = [['Nama','SAW','WP','Status SAW','Status WP']];
        foreach ($rtms as $rtm) {
            $scales = [
                'penghasilan'               => (float) ($rtm->penghasilanCriteria->scale ?? 0),
                'pengeluaran'               => (float) ($rtm->pengeluaranCriteria->scale ?? 0),
                'tempat_tinggal'            => (float) ($rtm->tempatTinggalCriteria->scale ?? 0),
                'status_kepemilikan_rumah'  => (float) ($rtm->statusKepemilikanRumahCriteria->scale ?? 0),
                'kondisi_rumah'             => (float) ($rtm->kondisiRumahCriteria->scale ?? 0),
                'aset_yang_dimiliki'        => (float) ($rtm->asetYangDimilikiCriteria->scale ?? 0),
                'transportasi'              => (float) ($rtm->transportasiCriteria->scale ?? 0),
                'penerangan_rumah'          => (float) ($rtm->peneranganRumahCriteria->scale ?? 0),
            ];

            $saw = 0.0;
            foreach ($scales as $k => $v) { $saw += $v * ($weights[$k] ?? 0.0); }

            $wp = 1.0;
            foreach ($scales as $k => $v) {
                $val = $v > 0 ? $v : 0.0001;
                $wp *= pow($val, ($weights[$k] ?? 0.0));
            }

            $rows[] = [
                $rtm->name,
                round($saw, 4),
                round($wp, 4),
                $saw >= 0.5 ? 'Miskin' : 'Tidak Miskin',
                $wp  >= 0.5 ? 'Miskin' : 'Tidak Miskin',
            ];
        }

        return $rows;
    }
}
