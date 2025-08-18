<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Pagination\LengthAwarePaginator;
use Barryvdh\DomPDF\Facade\Pdf;

class PublicResultController extends Controller
{
    public function index(Request $request)
    {
        $method  = strtolower($request->get('m', 'saw'));   // 'saw' | 'wp'
        $perPage = (int) $request->get('per_page', 25);
        $search  = trim($request->get('q', ''));

        $results = $this->fetchPublicResults($method, $search, $perPage, $request);

        return view('public.hasil', [
            'results' => $results,
            'method'  => $method,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $method = strtolower($request->get('m', 'saw'));
        $q      = trim($request->get('q', ''));

        $items = $this->fetchPublicCollection($method, $q);

        $pdf = Pdf::loadView('public.pdf.hasil', [
            'items'  => $items,
            'method' => strtoupper($method),
        ]);

        return $pdf->download("hasil-{$method}.pdf");
    }

    // ---------------- helpers ----------------

    protected function fetchPublicResults(string $method, string $search, int $perPage, Request $request)
    {
        // 1) ranking tabel generik: rankings(method, rank, alternative_id)
        if (Schema::hasTable('rankings')) {
            [$altTable, $nameCol] = $this->detectAltTableAndName();
            $query = DB::table('rankings')
                ->join($altTable, "{$altTable}.id", '=', 'rankings.alternative_id')
                ->where('rankings.method', $method)
                ->when($search !== '', fn($q) => $q->where("{$altTable}.{$nameCol}", 'like', "%{$search}%"))
                ->orderBy('rankings.rank')
                ->select(["{$altTable}.{$nameCol} as nama"]);
            return $query->paginate($perPage)->withQueryString();
        }

        // 2) tabel hasil admin: dukung beberapa skema umum
        if (Schema::hasTable('hasil')) {
            [$altTable, $nameCol] = $this->detectAltTableAndName();
            $query = DB::table('hasil')
                ->join($altTable, "{$altTable}.id", '=', 'hasil.alternative_id')
                ->when($search !== '', fn($q) => $q->where("{$altTable}.{$nameCol}", 'like', "%{$search}%"))
                ->when($method === 'saw', function ($q) {
                    if (Schema::hasColumn('hasil','rank_saw')) $q->orderBy('rank_saw');
                    elseif (Schema::hasColumn('hasil','saw'))  $q->orderByDesc('saw');
                })
                ->when($method === 'wp', function ($q) {
                    if (Schema::hasColumn('hasil','rank_wp')) $q->orderBy('rank_wp');
                    elseif (Schema::hasColumn('hasil','wp'))  $q->orderByDesc('wp');
                })
                ->select(["{$altTable}.{$nameCol} as nama"]);
            return $query->paginate($perPage)->withQueryString();
        }

        // 3) fallback dummy (supaya halaman publik tetap hidup)
        $data = collect([
            ['nama' => 'Zalfa'], ['nama' => 'Avi'],
            ['nama' => 'Budi'],  ['nama' => 'Paiman'],
        ])->filter(fn($r) => $search === '' || str_contains(strtolower($r['nama']), strtolower($search)))
          ->values();

        $page  = LengthAwarePaginator::resolveCurrentPage();
        $slice = $data->slice(($page - 1) * $perPage, $perPage)->values();

        return new LengthAwarePaginator($slice, $data->count(), $perPage, $page, [
            'path'  => $request->url(),
            'query' => $request->query(),
        ]);
    }

    protected function fetchPublicCollection(string $method, string $search)
    {
        if (Schema::hasTable('rankings')) {
            [$altTable, $nameCol] = $this->detectAltTableAndName();
            return DB::table('rankings')
                ->join($altTable, "{$altTable}.id", '=', 'rankings.alternative_id')
                ->where('rankings.method', $method)
                ->when($search !== '', fn($q) => $q->where("{$altTable}.{$nameCol}", 'like', "%{$search}%"))
                ->orderBy('rankings.rank')
                ->select(["{$altTable}.{$nameCol} as nama"])
                ->get();
        }

        if (Schema::hasTable('hasil')) {
            [$altTable, $nameCol] = $this->detectAltTableAndName();
            $q = DB::table('hasil')
                ->join($altTable, "{$altTable}.id", '=', 'hasil.alternative_id')
                ->when($search !== '', fn($qr) => $qr->where("{$altTable}.{$nameCol}", 'like', "%{$search}%"))
                ->select(["{$altTable}.{$nameCol} as nama"]);
            if ($method === 'saw') {
                if (Schema::hasColumn('hasil','rank_saw')) $q->orderBy('rank_saw');
                elseif (Schema::hasColumn('hasil','saw'))  $q->orderByDesc('saw');
            } else {
                if (Schema::hasColumn('hasil','rank_wp')) $q->orderBy('rank_wp');
                elseif (Schema::hasColumn('hasil','wp'))  $q->orderByDesc('wp');
            }
            return $q->get();
        }

        return collect([['nama'=>'Zalfa'],['nama'=>'Avi']]);
    }

    protected function detectAltTableAndName(): array
    {
        $altCandidates = ['alternatives','rtms','rumah_tangga_miskins','rumah_tangga_miskin'];
        $nameCandidates = ['nama','name','nama_kepala_keluarga','nama_rtm','keluarga'];
        $altTable = collect($altCandidates)->first(fn($t)=>Schema::hasTable($t)) ?? 'alternatives';

        $nameCol = collect($nameCandidates)->first(fn($c)=>Schema::hasColumn($altTable,$c)) ?? 'nama';
        return [$altTable, $nameCol];
    }
}
