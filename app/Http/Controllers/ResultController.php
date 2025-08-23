<?php

namespace App\Http\Controllers;

use App\Exports\ArrayExport;
use App\Models\Rtm;
use App\Models\Saw;
use App\Models\Setting;
use App\Models\Wp;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ResultController extends Controller
{
    public function index(Request $request)
    {
        $settings = Setting::whereIn('key', ['threshold_saw', 'threshold_wp'])->pluck('value', 'key');

        $perPage = $request->get('per_page', 20);
        $perPage = in_array($perPage, [20, 30, 40, 50]) ? $perPage : 20;

        $method = $request->get('method', 'saw');
        $search = $request->get('search');

        $query = Rtm::withScores()->select('id', 'name', 'address');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%');
            });
        }

        if ($method === 'saw') {
            $query->whereHas('saw')
                ->orderBy(
                    Saw::select('score')
                        ->whereColumn('saws.rtm_id', 'rtms.id')
                        ->limit(1)
                );
        } elseif ($method === 'wp') {
            $query->whereHas('wp')
                ->orderBy(
                    Wp::select('score')
                        ->whereColumn('wps.rtm_id', 'rtms.id')
                        ->limit(1)
                );
        }

        $rtms = $query->paginate($perPage);

        $rtms->appends($request->query());

        $countNoSaw = Rtm::whereDoesntHave('saw')->count();
        $countNoWp  = Rtm::whereDoesntHave('wp')->count();

        return Inertia::render('results', [
            'rtms' => $rtms,
            'filters' => [
                'order_by' => $method,
                'search' => $search,
            ],
            'stats' => [
                'saw' => $countNoSaw,
                'wp'  => $countNoWp,
            ],
            'tresholds' => [
                'saw' => (float) ($settings['threshold_saw'] ?? 0.5),
                'wp' => (float) ($settings['threshold_wp'] ?? 0.5),
            ]
        ]);
    }

    public function calculateResults()
    {
        try {
            $rtms = Rtm::withAllCriteria()->get();

            $maxCriteriaScales = [
                'penghasilan' => (string) ($rtms->max(fn($rtm) => $rtm->penghasilanCriteria->scale ?? 0)),
                'pengeluaran' => (string) ($rtms->max(fn($rtm) => $rtm->pengeluaranCriteria->scale ?? 0)),
                'tempat_tinggal' => (string) ($rtms->max(fn($rtm) => $rtm->tempatTinggalCriteria->scale ?? 0)),
                'status_kepemilikan_rumah' => (string) ($rtms->max(fn($rtm) => $rtm->statusKepemilikanRumahCriteria->scale ?? 0)),
                'kondisi_rumah' => (string) ($rtms->max(fn($rtm) => $rtm->kondisiRumahCriteria->scale ?? 0)),
                'aset' => (string) ($rtms->max(fn($rtm) => $rtm->asetYangDimilikiCriteria->scale ?? 0)),
                'transportasi' => (string) ($rtms->max(fn($rtm) => $rtm->transportasiCriteria->scale ?? 0)),
                'penerangan' => (string) ($rtms->max(fn($rtm) => $rtm->peneranganRumahCriteria->scale ?? 0)),
            ];

            $sawResults = $rtms->map(function ($rtm) use ($maxCriteriaScales) {
                $criteriaScales = collect([
                    'penghasilan' => (string) ($rtm->penghasilanCriteria->scale ?? '0'),
                    'pengeluaran' => (string) ($rtm->pengeluaranCriteria->scale ?? '0'),
                    'tempat_tinggal' => (string) ($rtm->tempatTinggalCriteria->scale ?? '0'),
                    'status_kepemilikan_rumah' => (string) ($rtm->statusKepemilikanRumahCriteria->scale ?? '0'),
                    'kondisi_rumah' => (string) ($rtm->kondisiRumahCriteria->scale ?? '0'),
                    'aset' => (string) ($rtm->asetYangDimilikiCriteria->scale ?? '0'),
                    'transportasi' => (string) ($rtm->transportasiCriteria->scale ?? '0'),
                    'penerangan' => (string) ($rtm->peneranganRumahCriteria->scale ?? '0'),
                ]);

                $criteriaWeights = collect([
                    'penghasilan' => (string) ($rtm->penghasilanCriteria->weight ?? '0'),
                    'pengeluaran' => (string) ($rtm->pengeluaranCriteria->weight ?? '0'),
                    'tempat_tinggal' => (string) ($rtm->tempatTinggalCriteria->weight ?? '0'),
                    'status_kepemilikan_rumah' => (string) ($rtm->statusKepemilikanRumahCriteria->weight ?? '0'),
                    'kondisi_rumah' => (string) ($rtm->kondisiRumahCriteria->weight ?? '0'),
                    'aset' => (string) ($rtm->asetYangDimilikiCriteria->weight ?? '0'),
                    'transportasi' => (string) ($rtm->transportasiCriteria->weight ?? '0'),
                    'penerangan' => (string) ($rtm->peneranganRumahCriteria->weight ?? '0'),
                ]);

                $normalizedScales = $criteriaScales->map(function ($scale, $key) use ($maxCriteriaScales) {
                    $maxScale = $maxCriteriaScales[$key] ?? '1';
                    return bccomp($maxScale, '0', 6) > 0
                        ? bcdiv($scale, $maxScale, 6)
                        : '0';
                });

                $vektorS = $criteriaScales->reduce(function ($carry, $value, $key) use ($criteriaWeights) {
                    $weight = (float) ($criteriaWeights[$key] ?? 0);
                    $originalValue = (float) $value;
                    $safeValue = $originalValue > 0 ? $originalValue : 0.0001;
                    $powered = pow($safeValue, $weight);
                    return $carry * $powered;
                }, 1.0);

                $vektorSFormatted = number_format($vektorS, 6, '.', '');

                $sawScore = $normalizedScales->reduce(function ($carry, $value, $key) use ($criteriaWeights) {
                    $weighted = bcmul($value, $criteriaWeights[$key] ?? '0', 6);
                    return bcadd($carry, $weighted, 6);
                }, '0');

                Saw::updateOrCreate(
                    ['rtm_id' => $rtm->id],
                    ['score' => $sawScore]
                );

                return [
                    'rtm_id' => $rtm->id,
                    'nama_kepala_keluarga' => $rtm->name ?? null,
                    'saw_score' => $sawScore,
                    'vektor_s' => $vektorSFormatted,
                ];
            });

            $totalVektorS = (string) $sawResults->sum(function ($result) {
                return (float) str_replace(',', '', $result['vektor_s']);
            });

            $wpResults = $sawResults->map(function ($result) use ($totalVektorS) {
                $vektorSFloat = (float) str_replace(',', '', $result['vektor_s']);
                $vektorSString = (string) $vektorSFloat;
                $wpScore = bccomp($totalVektorS, '0', 6) > 0
                    ? bcdiv($vektorSString, $totalVektorS, 6)
                    : '0';

                Wp::updateOrCreate(
                    ['rtm_id' => $result['rtm_id']],
                    ['score' => $wpScore]
                );

                return [
                    'rtm_id' => $result['rtm_id'],
                    'nama_kepala_keluarga' => $result['nama_kepala_keluarga'],
                    'wp_score' => $wpScore,
                    'saw_score' => $result['saw_score'],
                ];
            });

            return redirect()->back()->with([
                'success' => true,
                'message' => 'Perhitungan berhasil disimpan.',
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'success' => false,
                'message' => 'Terjadi kesalahan saat menghitung nilai. Silakan coba lagi.'
            ]);
        }
    }

    public function exportPdf(Request $request)
    {
        $filters = [
            'status' => $request->get('status'),
            'method' => $request->get('method', 'saw'),
        ];

        $settings = Setting::whereIn('key', ['threshold_saw', 'threshold_wp'])->pluck('value', 'key');

        $rows = $this->buildResults($filters);

        $pdf = Pdf::loadView('exports.result-pdf', [
            'printed_at' => now()->format('d/m/Y H:i'),
            'rows' => $rows,
            'method' => $filters['method'],
            'tresholds' => [
                'saw' => (float) ($settings['threshold_saw'] ?? 0.5),
                'wp' => (float) ($settings['threshold_wp'] ?? 0.5),
            ]
        ])->setPaper('a4', 'portrait');

        return $pdf->download('hasil-saw-wp.pdf');
    }

    public function exportExcel(Request $request)
    {
        $filters = [
            'status' => $request->get('status'),
            'method' => $request->get('method', 'saw'),
        ];

        $rows = $this->buildResults($filters);

        $head = ['No', 'NIK', 'Nama', 'Alamat', 'SAW', 'WP', 'Status SAW', 'Status WP'];
        $data = [];

        foreach ($rows as $index => $row) {
            $data[] = [
                $index + 1,
                $row['nik'],
                $row['nama'],
                $row['alamat'],
                number_format($row['saw'], 3, '.', ''),
                $row['status_saw'],
                number_format($row['wp'], 3, '.', ''),
                $row['status_wp'],
            ];
        }

        return Excel::download(new ArrayExport($head, $data), 'hasil-saw-wp.xlsx');
    }

    private function buildResults($filters)
    {
        $status = $filters['status'] ?? null;
        $method = $filters['method'] ?? 'saw';

        $settings = Setting::whereIn('key', ['threshold_saw', 'threshold_wp'])->pluck('value', 'key');

        $thresholdSaw = (float) ($settings['threshold_saw'] ?? 0.5);
        $thresholdWp  = (float) ($settings['threshold_wp'] ?? 0.5);

        $query = Rtm::withScores()->select('id', 'nik', 'name', 'address');

        if ($status === 'miskin') {
            $query->where(function ($q) use ($thresholdSaw, $thresholdWp) {
                $q->whereHas('saw', function ($sawQuery) use ($thresholdSaw) {
                    $sawQuery->where('score', '<=', $thresholdSaw);
                })->orWhereHas('wp', function ($wpQuery) use ($thresholdWp) {
                    $wpQuery->where('score', '<=', $thresholdWp);
                });
            });
        } elseif ($status === 'tidak_miskin') {
            $query->whereHas('saw', function ($sawQuery) use ($thresholdSaw) {
                $sawQuery->where('score', '>', $thresholdSaw);
            })->whereHas('wp', function ($wpQuery) use ($thresholdWp) {
                $wpQuery->where('score', '>', $thresholdWp);
            });
        }

        if ($method === 'saw') {
            $query->whereHas('saw')
                ->orderBy(
                    Saw::select('score')
                        ->whereColumn('saws.rtm_id', 'rtms.id')
                        ->limit(1),
                );
        } elseif ($method === 'wp') {
            $query->whereHas('wp')
                ->orderBy(
                    Wp::select('score')
                        ->whereColumn('wps.rtm_id', 'rtms.id')
                        ->limit(1),
                );
        }

        $rtms = $query->get();

        $rows = $rtms->map(function ($rtm, $index) use ($thresholdSaw, $thresholdWp) {
            $sawScore = $rtm->saw ? (float) $rtm->saw->score : 0;
            $wpScore  = $rtm->wp ? (float) $rtm->wp->score : 0;

            return [
                'no' => $index + 1,
                'id' => $rtm->id,
                'nik' => $rtm->nik,
                'nama' => $rtm->name,
                'alamat' => $rtm->address,
                'saw' => round($sawScore, 3),
                'wp' => round($wpScore, 3),
                'status_saw' => $sawScore <= $thresholdSaw ? 'Miskin' : 'Tidak Miskin',
                'status_wp'  => $wpScore  <= $thresholdWp  ? 'Miskin' : 'Tidak Miskin',
            ];
        })->toArray();

        return $rows;
    }

    public function exportMcrPdf()
    {
        $mcrDelta = (float) (Setting::where('key', 'mcr_delta')->value('value') ?? 0.05);

        $sensitivityResults = $this->buildSensitivitas();

        $summary = [];
        $detailRows = [];

        foreach ($sensitivityResults as $criteria => $deltas) {
            $sawChanges = [];
            $wpChanges = [];

            foreach ($deltas as $deltaLevel => $results) {
                $sawPercent = (float) str_replace('%', '', $results['saw_percent_change']);
                $wpPercent = (float) str_replace('%', '', $results['wp_percent_change']);

                $sawChanges[] = abs($sawPercent);
                $wpChanges[] = abs($wpPercent);

                $detailRows[] = [
                    'kriteria' => $this->getCriteriaDisplayName($criteria),
                    'delta' => '+' . ($deltaLevel * 100) . '%',
                    'avg_change_saw' => $sawPercent,
                    'avg_change_wp' => $wpPercent,
                ];
            }

            $summary[] = [
                'kriteria' => $this->getCriteriaDisplayName($criteria),
                'mcr_saw' => count($sawChanges) > 0 ? array_sum($sawChanges) / count($sawChanges) : 0,
                'mcr_wp' => count($wpChanges) > 0 ? array_sum($wpChanges) / count($wpChanges) : 0,
            ];
        }

        usort($summary, function ($a, $b) {
            return $b['mcr_wp'] <=> $a['mcr_wp'];
        });

        // $data = [
        //     'printed_at' => now()->format('d/m/Y H:i:s'),
        //     'summary' => $summary,
        //     'rows' => $detailRows,
        //     'analysis_info' => [
        //         'total_rtm' => Rtm::count(),
        //         'delta_levels' => [$mcrDelta, $mcrDelta + $mcrDelta],
        //         'method_comparison' => $this->getMethodComparison($summary),
        //     ],
        //     'title' => 'Laporan MCR',
        // ];

        // return view('exports.mcr-pdf', $data);

        $pdf = PDF::loadView('exports.mcr-pdf', [
            'printed_at' => now()->format('d/m/Y H:i:s'),
            'summary' => $summary,
            'rows' => $detailRows,
            'analysis_info' => [
                'total_rtm' => Rtm::count(),
                'delta_levels' => [$mcrDelta, $mcrDelta + $mcrDelta],
                'method_comparison' => $this->getMethodComparison($summary),
            ]
        ]);

        return $pdf->download('mcr-saw-wp.pdf');
    }

    private function getCriteriaDisplayName($criteria)
    {
        $displayNames = [
            'penghasilan' => 'Penghasilan',
            'pengeluaran' => 'Pengeluaran',
            'tempat_tinggal' => 'Tempat Tinggal',
            'status_kepemilikan_rumah' => 'Status Kepemilikan Rumah',
            'kondisi_rumah' => 'Kondisi Rumah',
            'aset' => 'Aset yang Dimiliki',
            'transportasi' => 'Transportasi',
            'penerangan' => 'Penerangan Rumah',
        ];

        return $displayNames[$criteria] ?? ucfirst(str_replace('_', ' ', $criteria));
    }

    private function getMethodComparison($summary)
    {
        $sawAvg = array_sum(array_column($summary, 'mcr_saw')) / count($summary);
        $wpAvg = array_sum(array_column($summary, 'mcr_wp')) / count($summary);

        return [
            'saw_average_sensitivity' => $sawAvg,
            'wp_average_sensitivity' => $wpAvg,
            'sensitivity_ratio' => $sawAvg > 0 ? ($wpAvg / $sawAvg) : 0,
            'most_sensitive_criteria' => $summary[0]['kriteria'] ?? 'N/A',
            'least_sensitive_criteria' => end($summary)['kriteria'] ?? 'N/A',
        ];
    }

    public function buildSensitivitas()
    {
        // 1. Gunakan delta yang lebih kecil untuk analisis sensitivitas
        $mcrDelta = (float) (Setting::where('key', 'mcr_delta')->value('value') ?? 0.05);

        // 2. Hitung ulang baseline scores untuk memastikan konsistensi
        $rtms = Rtm::withAllCriteria()->get();

        // Dapatkan max criteria scales
        $maxCriteriaScales = [
            'penghasilan' => (string) ($rtms->max(fn($rtm) => $rtm->penghasilanCriteria->scale ?? 0)),
            'pengeluaran' => (string) ($rtms->max(fn($rtm) => $rtm->pengeluaranCriteria->scale ?? 0)),
            'tempat_tinggal' => (string) ($rtms->max(fn($rtm) => $rtm->tempatTinggalCriteria->scale ?? 0)),
            'status_kepemilikan_rumah' => (string) ($rtms->max(fn($rtm) => $rtm->statusKepemilikanRumahCriteria->scale ?? 0)),
            'kondisi_rumah' => (string) ($rtms->max(fn($rtm) => $rtm->kondisiRumahCriteria->scale ?? 0)),
            'aset' => (string) ($rtms->max(fn($rtm) => $rtm->asetYangDimilikiCriteria->scale ?? 0)),
            'transportasi' => (string) ($rtms->max(fn($rtm) => $rtm->transportasiCriteria->scale ?? 0)),
            'penerangan' => (string) ($rtms->max(fn($rtm) => $rtm->peneranganRumahCriteria->scale ?? 0)),
        ];

        // Ambil bobot asli dari RTM pertama sebagai referensi
        $firstRtm = $rtms->first();
        $originalWeights = [
            'penghasilan' => (float) ($firstRtm->penghasilanCriteria->weight ?? 0.125),
            'pengeluaran' => (float) ($firstRtm->pengeluaranCriteria->weight ?? 0.125),
            'tempat_tinggal' => (float) ($firstRtm->tempatTinggalCriteria->weight ?? 0.125),
            'status_kepemilikan_rumah' => (float) ($firstRtm->statusKepemilikanRumahCriteria->weight ?? 0.125),
            'kondisi_rumah' => (float) ($firstRtm->kondisiRumahCriteria->weight ?? 0.125),
            'aset' => (float) ($firstRtm->asetYangDimilikiCriteria->weight ?? 0.125),
            'transportasi' => (float) ($firstRtm->transportasiCriteria->weight ?? 0.125),
            'penerangan' => (float) ($firstRtm->peneranganRumahCriteria->weight ?? 0.125),
        ];

        // 3. Hitung baseline scores dengan bobot asli untuk konsistensi
        $baselineResults = $this->calculateMcr($rtms, $maxCriteriaScales, $originalWeights);
        $sawMaxScore = $baselineResults['saw_max'];
        $wpMaxScore = $baselineResults['wp_max'];

        $sensitivityResults = [];
        $criteriaNames = array_keys($originalWeights);

        // 4. Tambahkan beberapa tingkat delta untuk analisis yang lebih comprehensive
        $deltaLevels = [$mcrDelta, $mcrDelta + $mcrDelta]; // 5% dan 10%

        // Loop untuk setiap kriteria
        foreach ($criteriaNames as $targetCriteria) {
            $sensitivityResults[$targetCriteria] = [];

            foreach ($deltaLevels as $deltaLevel) {
                // Modifikasi bobot dengan delta
                $modifiedWeights = $originalWeights;
                $modifiedWeights[$targetCriteria] += $deltaLevel;

                // 5. Normalisasi bobot dengan precision yang lebih baik
                $totalWeight = array_sum($modifiedWeights);
                foreach ($modifiedWeights as $key => $weight) {
                    $modifiedWeights[$key] = $weight / $totalWeight;
                }

                // Hitung scores dengan bobot yang dimodifikasi
                $modifiedResults = $this->calculateMcr($rtms, $maxCriteriaScales, $modifiedWeights);

                $sawDifference = bcsub((string) $modifiedResults['saw_max'], (string) $sawMaxScore, 8);
                $wpDifference = bcsub((string) $modifiedResults['wp_max'], (string) $wpMaxScore, 8);

                $sensitivityResults[$targetCriteria][number_format($deltaLevel, 2)] = [
                    'saw_difference' => $sawDifference,
                    'wp_difference' => $wpDifference,
                    'saw_percent_change' => $sawMaxScore > 0 ? bcmul(bcdiv($sawDifference, (string) $sawMaxScore, 10), '100', 6) . '%' : '0%',
                    'wp_percent_change' => $wpMaxScore > 0 ? bcmul(bcdiv($wpDifference, (string) $wpMaxScore, 10), '100', 6) . '%' : '0%',
                ];
            }
        }

        return $sensitivityResults;
    }

    private function calculateMcr($rtms, $maxCriteriaScales, $weights)
    {
        $sawResults = $rtms->map(function ($rtm) use ($maxCriteriaScales, $weights) {
            $criteriaScales = collect([
                'penghasilan' => (string) ($rtm->penghasilanCriteria->scale ?? '0'),
                'pengeluaran' => (string) ($rtm->pengeluaranCriteria->scale ?? '0'),
                'tempat_tinggal' => (string) ($rtm->tempatTinggalCriteria->scale ?? '0'),
                'status_kepemilikan_rumah' => (string) ($rtm->statusKepemilikanRumahCriteria->scale ?? '0'),
                'kondisi_rumah' => (string) ($rtm->kondisiRumahCriteria->scale ?? '0'),
                'aset' => (string) ($rtm->asetYangDimilikiCriteria->scale ?? '0'),
                'transportasi' => (string) ($rtm->transportasiCriteria->scale ?? '0'),
                'penerangan' => (string) ($rtm->peneranganRumahCriteria->scale ?? '0'),
            ]);

            $criteriaWeights = collect([
                'penghasilan' => (string) $weights['penghasilan'],
                'pengeluaran' => (string) $weights['pengeluaran'],
                'tempat_tinggal' => (string) $weights['tempat_tinggal'],
                'status_kepemilikan_rumah' => (string) $weights['status_kepemilikan_rumah'],
                'kondisi_rumah' => (string) $weights['kondisi_rumah'],
                'aset' => (string) $weights['aset'],
                'transportasi' => (string) $weights['transportasi'],
                'penerangan' => (string) $weights['penerangan'],
            ]);

            $normalizedScales = $criteriaScales->map(function ($scale, $key) use ($maxCriteriaScales) {
                $maxScale = $maxCriteriaScales[$key] ?? '1';
                return bccomp($maxScale, '0', 8) > 0
                    ? bcdiv($scale, $maxScale, 8)
                    : '0';
            });
            $sawScore = $normalizedScales->reduce(function ($carry, $value, $key) use ($criteriaWeights) {
                $weighted = bcmul($value, $criteriaWeights[$key] ?? '0', 8);
                return bcadd($carry, $weighted, 8);
            }, '0');

            $vektorS = $criteriaScales->reduce(function ($carry, $value, $key) use ($weights) {
                $weight = (float) $weights[$key];
                $originalValue = (float) $value;
                $safeValue = $originalValue > 0 ? $originalValue : 1e-10;
                $powered = pow($safeValue, $weight);
                return $carry * $powered;
            }, 1.0);

            return [
                'rtm_id' => $rtm->id,
                'nama_kepala_keluarga' => $rtm->name ?? null,
                'saw_score' => (float) $sawScore,
                'vektor_s' => $vektorS,
            ];
        });

        $totalVektorS = (string) $sawResults->sum('vektor_s');

        $wpResults = $sawResults->map(function ($result) use ($totalVektorS) {
            $vektorSString = (string) $result['vektor_s'];
            $wpScore = bccomp($totalVektorS, '0', 8) > 0
                ? bcdiv($vektorSString, $totalVektorS, 8)
                : '0';

            return [
                'rtm_id' => $result['rtm_id'],
                'nama_kepala_keluarga' => $result['nama_kepala_keluarga'],
                'wp_score' => (float) $wpScore,
                'saw_score' => $result['saw_score'],
            ];
        });

        return [
            'saw_results' => $sawResults,
            'wp_results' => $wpResults,
            'saw_max' => $sawResults->max('saw_score'),
            'wp_max' => $wpResults->max('wp_score'),
        ];
    }
}
