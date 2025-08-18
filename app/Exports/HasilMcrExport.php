<?php

namespace App\Exports;

use App\Models\Criteria;
use App\Models\Rtm;
use Maatwebsite\Excel\Concerns\FromArray;

class HasilMcrExport implements FromArray
{
    public function array(): array
    {
        $weights = Criteria::all()
            ->groupBy('type')
            ->map(fn($g) => (float) optional($g->first())->weight ?? 0.0)
            ->toArray();

        $rtms = Rtm::withAllCriteria()->get();
        $dataset = [];
        foreach ($rtms as $rtm) {
            $dataset[] = [
                'penghasilan'               => (float) ($rtm->penghasilanCriteria->scale ?? 0),
                'pengeluaran'               => (float) ($rtm->pengeluaranCriteria->scale ?? 0),
                'tempat_tinggal'            => (float) ($rtm->tempatTinggalCriteria->scale ?? 0),
                'status_kepemilikan_rumah'  => (float) ($rtm->statusKepemilikanRumahCriteria->scale ?? 0),
                'kondisi_rumah'             => (float) ($rtm->kondisiRumahCriteria->scale ?? 0),
                'aset_yang_dimiliki'        => (float) ($rtm->asetYangDimilikiCriteria->scale ?? 0),
                'transportasi'              => (float) ($rtm->transportasiCriteria->scale ?? 0),
                'penerangan_rumah'          => (float) ($rtm->peneranganRumahCriteria->scale ?? 0),
            ];
        }

        $baseline = $this->computeScores($weights, $dataset);

        $rowsDetail = [];
        $summary = [];
        $criteriaKeys = array_keys($weights);

        foreach ($criteriaKeys as $key) {
            $items = [];
            foreach ([0.5, 1.0] as $delta) {
                $w2 = $weights;
                $w2[$key] = ($w2[$key] ?? 0.0) + $delta;
                $sum = array_sum($w2);
                if ($sum <= 0) continue;
                foreach ($w2 as $k => $v) { $w2[$k] = $v / $sum; }

                $new = $this->computeScores($w2, $dataset);
                $avgSaw = $this->avgChangePct($baseline['saw'], $new['saw']);
                $avgWp  = $this->avgChangePct($baseline['wp'],  $new['wp']);

                $rowsDetail[] = [$key, $delta, $avgSaw, $avgWp];
                $items[] = [$avgSaw, $avgWp];
            }
            if ($items) {
                $mcrSaw = array_sum(array_column($items, 0)) / count($items);
                $mcrWp  = array_sum(array_column($items, 1)) / count($items);
                $summary[] = [$key, round($mcrSaw, 3), round($mcrWp, 3)];
            }
        }

        usort($summary, fn($a,$b) => $b[1] <=> $a[1]); // sort by MCR SAW desc

        $out = [];
        $out[] = ['MCR per Kriteria'];
        $out[] = ['Kriteria','MCR SAW (%)','MCR WP (%)'];
        foreach ($summary as $r) $out[] = $r;
        $out[] = [''];
        $out[] = ['Detail'];
        $out[] = ['Kriteria','Δ Bobot','Δ% SAW (avg)','Δ% WP (avg)'];
        foreach ($rowsDetail as $r) $out[] = $r;

        return $out;
    }

    private function computeScores(array $weights, array $dataset): array
    {
        $saw = []; $wp = [];
        foreach ($dataset as $row) {
            $sawScore = 0.0;
            foreach ($weights as $k => $w) $sawScore += ($row[$k] ?? 0.0) * (float)$w;
            $saw[] = $sawScore;

            $wpScore = 1.0;
            foreach ($weights as $k => $w) {
                $val = ($row[$k] ?? 0.0);
                $val = $val > 0 ? $val : 0.0001;
                $wpScore *= pow($val, (float)$w);
            }
            $wp[] = $wpScore;
        }
        return ['saw' => $saw, 'wp' => $wp];
    }

    private function avgChangePct(array $base, array $new): float
    {
        $n = max(count($base), count($new));
        if ($n === 0) return 0.0;
        $sum = 0.0;
        for ($i=0;$i<$n;$i++) {
            $b = $base[$i] ?? 0.0;
            $a = $new[$i] ?? 0.0;
            $den = ($b != 0.0) ? abs($b) : 0.0001;
            $sum += abs(($a - $b) / $den) * 100.0;
        }
        return round($sum / $n, 3);
    }
}
