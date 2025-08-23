<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Criteria;
use App\Models\Rtm;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ArrayExport;

class HasilController extends Controller
{
    private array $typeLabel = [
        'penghasilan' => 'Penghasilan',
        'pengeluaran' => 'Pengeluaran',
        'tempat_tinggal' => 'Tempat Tinggal',
        'status_kepemilikan_rumah' => 'Status Kepemilikan Rumah',
        'kondisi_rumah' => 'Kondisi Rumah',
        'aset_yang_dimiliki' => 'Aset yang Dimiliki',
        'transportasi' => 'Transportasi',
        'penerangan_rumah' => 'Penerangan Rumah',
    ];

    private function getNormalizedWeights(): array
    {
        $weightsRaw = Criteria::all()
            ->groupBy('type')
            ->map(fn($g) => (float) optional($g->first())->weight ?? 0.0)
            ->toArray();

        $sumW = array_sum($weightsRaw) ?: 1.0;
        $w = [];
        foreach ($weightsRaw as $k => $v) {
            $w[$k] = $v / $sumW;
        }
        return $w;
    }

    private function computeScores(array $w): array
    {
        $threshold = (float) Setting::get('sawwp_threshold', config('sawwp.threshold', 0.5));
        $rtms = Rtm::withAllCriteria()->get();
        $rows = [];
        $wpProducts = [];

        foreach ($rtms as $rtm) {
            $scales = [
                'penghasilan' => (float) ($rtm->penghasilanCriteria->scale ?? 0),
                'pengeluaran' => (float) ($rtm->pengeluaranCriteria->scale ?? 0),
                'tempat_tinggal' => (float) ($rtm->tempatTinggalCriteria->scale ?? 0),
                'status_kepemilikan_rumah' => (float) ($rtm->statusKepemilikanRumahCriteria->scale ?? 0),
                'kondisi_rumah' => (float) ($rtm->kondisiRumahCriteria->scale ?? 0),
                'aset_yang_dimiliki' => (float) ($rtm->asetYangDimilikiCriteria->scale ?? 0),
                'transportasi' => (float) ($rtm->transportasiCriteria->scale ?? 0),
                'penerangan_rumah' => (float) ($rtm->peneranganRumahCriteria->scale ?? 0),
            ];

            $saw = 0.0;
            foreach ($scales as $k => $v) {
                $saw += $v * ($w[$k] ?? 0.0);
            }

            $wpRaw = 1.0;
            foreach ($scales as $k => $v) {
                $val = $v > 0 ? $v : 0.0001;
                $wpRaw *= pow($val, ($w[$k] ?? 0.0));
            }

            $rows[] = [
                'id' => $rtm->id,
                'nama' => $rtm->name,
                'nik' => $rtm->nik,
                'saw' => $saw,
                'wp_raw' => $wpRaw,
            ];
            $wpProducts[] = $wpRaw;
        }

        $sumWp = array_sum($wpProducts) ?: 1.0;
        foreach ($rows as &$r) {
            $r['wp'] = $r['wp_raw'] / $sumWp;
            unset($r['wp_raw']);
            $r['status_saw'] = $r['saw'] >= $threshold ? 'Miskin' : 'Tidak Miskin';
            $r['status_wp'] = $r['wp'] >= $threshold ? 'Miskin' : 'Tidak Miskin';
        }
        unset($r);

        return $rows;
    }

    private function buildRows(array $filters): array
    {
        $q = trim($filters['q'] ?? '');
        $status = $filters['status'] ?? null;
        $method = $filters['method'] ?? 'SAW';

        $w = $this->getNormalizedWeights();
        $rows = $this->computeScores($w);

        $rows = array_values(array_filter($rows, function ($r) use ($q, $status) {
            if ($q !== '' && stripos($r['nama'] . ' ' . $r['nik'], $q) === false) {
                return false;
            }
            if ($status === 'miskin') {
                return $r['status_saw'] === 'Miskin' || $r['status_wp'] === 'Miskin';
            }
            if ($status === 'tidak') {
                return $r['status_saw'] === 'Tidak Miskin' && $r['status_wp'] === 'Tidak Miskin';
            }
            return true;
        }));

        usort($rows, function ($a, $b) use ($method) {
            $key = $method === 'SAW' ? 'saw' : 'wp';
            return $b[$key] <=> $a[$key];
        });

        foreach ($rows as &$r) {
            $r['saw'] = round($r['saw'], 3);
            $r['wp'] = round($r['wp'], 3);
        }
        unset($r);

        return $rows;
    }

    public function index(Request $request)
    {
        $filters = [
            'q' => $request->get('q'),
            'status' => $request->get('status'),
            'method' => $request->get('method', 'SAW'),
        ];

        $allRows = collect($this->buildRows($filters));
        $page = max(1, (int) $request->get('page', 1));
        $perPage = (int) $request->get('perPage', 20);
        $total = $allRows->count();
        $items = $allRows->slice(($page - 1) * $perPage, $perPage)->values();
        $last = (int) ceil(max(1, $total) / $perPage);

        $links = [
            'prev' => $page > 1 ? url()->current() . '?' . http_build_query(array_merge($request->query(), ['page' => $page - 1])) : null,
            'next' => $page < $last ? url()->current() . '?' . http_build_query(array_merge($request->query(), ['page' => $page + 1])) : null,
        ];

        return Inertia::render('hasil', [
            'rows' => $items,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => $last,
                'links' => $links,
            ],
            'filters' => $filters,
        ]);
    }

    public function exportPDF(Request $request)
    {
        $filters = [
            'q' => $request->get('q'),
            'status' => $request->get('status'),
            'method' => $request->get('method', 'SAW'),
        ];
        $rows = $this->buildRows($filters);

        $pdf = Pdf::loadView('exports.hasil', [
            'rows' => $rows,
            'method' => $filters['method'],
            'printed_at' => now()->format('d/m/Y H:i'),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('hasil-saw-wp.pdf');
    }

    public function exportExcel(Request $request)
    {
        $filters = [
            'q' => $request->get('q'),
            'status' => $request->get('status'),
            'method' => $request->get('method', 'SAW'),
        ];
        $rows = $this->buildRows($filters);

        $head = ['No', 'NIK', 'Nama', 'SAW', 'WP', 'Status SAW', 'Status WP'];
        $data = [];
        $i = 1;
        foreach ($rows as $r) {
            $data[] = [
                $i++,
                $r['nik'],
                $r['nama'],
                number_format($r['saw'], 3, '.', ''),
                number_format($r['wp'], 3, '.', ''),
                $r['status_saw'],
                $r['status_wp'],
            ];
        }

        return Excel::download(new ArrayExport($head, $data), 'hasil-saw-wp.xlsx');
    }

    public function sensitivitas(Request $request)
    {
        $delta = (float) Setting::get('sawwp_mcr_delta', config('sawwp.mcr_delta', 0.05));
        $deltas = [-$delta, +$delta];

        $baseW = $this->getNormalizedWeights();
        $base = $this->computeScores($baseW);
        $baseById = [];
        foreach ($base as $b) {
            $baseById[$b['id']] = $b;
        }

        $rows = [];
        $sumPerCrit = [];

        foreach ($baseW as $crit => $wval) {
            foreach ($deltas as $d) {
                $w2 = $baseW;
                $w2[$crit] = max(0.0, $w2[$crit] + $d);
                $sum = array_sum($w2) ?: 1.0;
                foreach ($w2 as $k => &$vv) {
                    $vv = $vv / $sum;
                }
                unset($vv);

                $alt = $this->computeScores($w2);
                $altById = [];
                foreach ($alt as $a) {
                    $altById[$a['id']] = $a;
                }

                $accSaw = 0.0;
                $accWp = 0.0;
                $n = 0;
                foreach ($baseById as $id => $b) {
                    if (!isset($altById[$id])) {
                        continue;
                    }
                    $pcSaw = $b['saw'] != 0.0 ? (($altById[$id]['saw'] - $b['saw']) / $b['saw']) * 100.0 : 0.0;
                    $pcWp = $b['wp'] != 0.0 ? (($altById[$id]['wp'] - $b['wp']) / $b['wp']) * 100.0 : 0.0;
                    $accSaw += abs($pcSaw);
                    $accWp += abs($pcWp);
                    $n++;
                }
                $avgSaw = $n ? $accSaw / $n : 0.0;
                $avgWp = $n ? $accWp / $n : 0.0;

                $rows[] = [
                    'kriteria' => $this->typeLabel[$crit] ?? $crit,
                    'delta' => $d,
                    'avg_change_saw' => round($avgSaw, 3),
                    'avg_change_wp' => round($avgWp, 3),
                ];

                if (!isset($sumPerCrit[$crit])) {
                    $sumPerCrit[$crit] = ['saw' => 0.0, 'wp' => 0.0, 'n' => 0];
                }
                $sumPerCrit[$crit]['saw'] += $avgSaw;
                $sumPerCrit[$crit]['wp'] += $avgWp;
                $sumPerCrit[$crit]['n'] += 1;
            }
        }

        $summary = [];
        foreach ($sumPerCrit as $crit => $acc) {
            $summary[] = [
                'kriteria' => $this->typeLabel[$crit] ?? $crit,
                'mcr_saw' => round($acc['saw'] / max(1, $acc['n']), 3),
                'mcr_wp' => round($acc['wp'] / max(1, $acc['n']), 3),
            ];
        }
        usort($summary, fn($a, $b) => ($b['mcr_saw'] + $b['mcr_wp']) <=> ($a['mcr_saw'] + $a['mcr_wp']));

        return response()->json(['rows' => $rows, 'summary' => $summary]);
    }

    public function exportMCRPDF(Request $request)
    {
        $data = $this->sensitivitas($request)->getData(true);
        $pdf = Pdf::loadView('exports.mcr-pdf', [
            'rows' => $data['rows'],
            'summary' => $data['summary'],
            'printed_at' => now()->format('d/m/Y H:i'),
        ])->setPaper('a4', 'portrait');

        return $pdf->download('mcr-saw-wp.pdf');
    }

    public function exportMCRExcel(Request $request)
    {
        $data = $this->sensitivitas($request)->getData(true);

        $headSummary = ['Kriteria', 'MCR SAW (%)', 'MCR WP (%)'];
        $rowsSummary = [];
        foreach ($data['summary'] as $s) {
            $rowsSummary[] = [
                $s['kriteria'],
                number_format($s['mcr_saw'], 3, '.', ''),
                number_format($s['mcr_wp'], 3, '.', ''),
            ];
        }

        $headDetail = ['Kriteria', 'Delta Bobot', 'Δ% SAW (avg)', 'Δ% WP (avg)'];
        $rowsDetail = [];
        foreach ($data['rows'] as $r) {
            $rowsDetail[] = [
                $r['kriteria'],
                $r['delta'],
                number_format($r['avg_change_saw'], 3, '.', ''),
                number_format($r['avg_change_wp'], 3, '.', ''),
            ];
        }

        return Excel::download(new class($headSummary, $rowsSummary, $headDetail, $rowsDetail) implements \Maatwebsite\Excel\Concerns\WithMultipleSheets {
            private $headSummary;
            private $rowsSummary;
            private $headDetail;
            private $rowsDetail;
            public function __construct($hs, $rs, $hd, $rd)
            {
                $this->headSummary = $hs;
                $this->rowsSummary = $rs;
                $this->headDetail = $hd;
                $this->rowsDetail = $rd;
            }
            public function sheets(): array
            {
                return [
                    new \App\Exports\ArrayExport($this->headSummary, $this->rowsSummary),
                    new \App\Exports\ArrayExport($this->headDetail, $this->rowsDetail),
                ];
            }
        }, 'mcr-saw-wp.xlsx');
    }
}
