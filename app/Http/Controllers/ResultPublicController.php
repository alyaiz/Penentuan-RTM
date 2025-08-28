<?php

namespace App\Http\Controllers;

use App\Exports\SingleSheetArrayPublicExport;
use App\Models\Rtm;
use App\Models\Saw;
use App\Models\Setting;
use App\Models\Wp;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ResultPublicController extends Controller
{
    public function index(Request $request)
    {
        $settings = Setting::whereIn('key', ['threshold_saw', 'threshold_wp'])->pluck('value', 'key');

        $perPage = $request->get('per_page', 20);
        $perPage = in_array($perPage, [20, 30, 40, 50]) ? $perPage : 20;

        $metode = $request->get('metode', 'saw');
        $status = $request->get('status');
        $search = $request->get('search');

        $query = Rtm::withScores()->select('id', 'name', 'address');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%');
            });
        }

        if ($metode === 'saw') {
            $threshold = (float) ($settings['threshold_saw'] ?? 0);

            if ($status) {
                $query->whereHas('saw', function ($q) use ($status, $threshold) {
                    if ($status === 'miskin') {
                        $q->where('score', '<', $threshold);
                    } elseif ($status === 'tidak_miskin') {
                        $q->where('score', '>=', $threshold);
                    }
                });
            }

            $query->orderBy(
                Saw::select('score')
                    ->whereColumn('saws.rtm_id', 'rtms.id')
                    ->limit(1)
            );
        }

        if ($metode === 'wp') {
            $threshold = (float) ($settings['threshold_wp'] ?? 0);

            if ($status) {
                $query->whereHas('wp', function ($q) use ($status, $threshold) {
                    if ($status === 'miskin') {
                        $q->where('score', '<', $threshold);
                    } elseif ($status === 'tidak_miskin') {
                        $q->where('score', '>=', $threshold);
                    }
                });
            }

            $query->orderBy(
                Wp::select('score')
                    ->whereColumn('wps.rtm_id', 'rtms.id')
                    ->limit(1)
            );
        }

        $rtms = $query->paginate($perPage);

        $rtms->appends($request->query());

        return Inertia::render('results-public', [
            'rtms' => $rtms,
            'filters' => [
                'order_by' => $metode,
                'search' => $search,
            ],
            'tresholds' => [
                'saw' => (float) ($settings['threshold_saw'] ?? 0.5),
                'wp' => (float) ($settings['threshold_wp'] ?? 0.5),
            ]
        ]);
    }

    public function exportPdf(Request $request)
    {
        try {
            $filters = [
                'status' => $request->get('status'),
                'metode' => $request->get('metode', 'saw'),
            ];

            $settings = Setting::whereIn('key', ['threshold_saw', 'threshold_wp'])->pluck('value', 'key');

            $rows = $this->buildResults($filters);

            $pdf = Pdf::loadView('exports.result-public-pdf', [
                'printed_at' => now()->format('d/m/Y H:i'),
                'rows' => $rows,
                'metode' => $filters['metode'],
                'thresholds' => [
                    'saw' => (float) ($settings['threshold_saw'] ?? 0.5),
                    'wp' => (float) ($settings['threshold_wp'] ?? 0.5),
                ]
            ])->setPaper('a4', 'portrait');

            $filename = 'hasil-saw-wp-' . now()->format('Ymd_His') . '.pdf';
            $path = storage_path('app/public/results/pdf/' . $filename);

            if (!file_exists(dirname($path))) {
                mkdir(dirname($path), 0755, true);
            }

            file_put_contents($path, $pdf->output());

            return response()->json([
                'success' => true,
                'path' => asset('storage/results/pdf/' . $filename),
                'filename' => $filename
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat file PDF: ' . $e->getMessage()
            ], 500);
        }
    }

    public function exportExcel(Request $request)
    {
        try {
            $filters = [
                'status' => $request->get('status'),
                'metode' => $request->get('metode', 'saw'),
            ];

            $rows = $this->buildResults($filters);

            $head = ['No', 'Nama', 'Alamat'];

            $data = [];
            foreach ($rows as $index => $row) {
                $data[] = [
                    $index + 1,
                    $row['nama'] ?? '-',
                    $row['alamat'] ?? '-',
                ];
            }

            $filename = 'hasil-saw-wp.xlsx';

            return Excel::download(new SingleSheetArrayPublicExport($head, $data, $filters['metode'], $filters), $filename);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat file Excel: ' . $e->getMessage()
            ], 500);
        }
    }

    private function buildResults($filters)
    {
        $status = $filters['status'] ?? null;
        $metode = $filters['metode'] ?? 'saw';

        $settings = Setting::whereIn('key', ['threshold_saw', 'threshold_wp'])->pluck('value', 'key');

        $thresholdSaw = (float) ($settings['threshold_saw'] ?? 0.5);
        $thresholdWp  = (float) ($settings['threshold_wp'] ?? 0.5);

        $query = Rtm::withScores()->select('id', 'name', 'address');

        if ($metode === 'saw') {
            if ($status) {
                $query->whereHas('saw', function ($q) use ($status, $thresholdSaw) {
                    if ($status === 'miskin') {
                        $q->where('score', '<', $thresholdSaw);
                    } elseif ($status === 'tidak_miskin') {
                        $q->where('score', '>=', $thresholdSaw);
                    }
                });
            }

            $query->orderBy(
                Saw::select('score')
                    ->whereColumn('saws.rtm_id', 'rtms.id')
                    ->limit(1)
            );
        }

        if ($metode === 'wp') {
            if ($status) {
                $query->whereHas('wp', function ($q) use ($status, $thresholdWp) {
                    if ($status === 'miskin') {
                        $q->where('score', '<', $thresholdWp);
                    } elseif ($status === 'tidak_miskin') {
                        $q->where('score', '>=', $thresholdWp);
                    }
                });
            }

            $query->orderBy(
                Wp::select('score')
                    ->whereColumn('wps.rtm_id', 'rtms.id')
                    ->limit(1)
            );
        }

        $rtms = $query->get();

        $rows = $rtms->map(function ($rtm, $index) use ($thresholdSaw, $thresholdWp) {
            $sawScore = $rtm->saw ? (float) $rtm->saw->score : 0;
            $wpScore  = $rtm->wp ? (float) $rtm->wp->score : 0;

            return [
                'no' => $index + 1,
                'id' => $rtm->id,
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
}
