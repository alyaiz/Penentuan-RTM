<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessCalculate;
use App\Models\Criteria;
use App\Models\Rtm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RtmController extends Controller
{
    public function index(Request $request)
    {
        $rtm = $query = Rtm::withAllCriteria()->findOrFail(1);
        $criteriaScales = collect([
            'penghasilan' => $rtm->penghasilanCriteria->scale ?? 0,
            'pengeluaran' => $rtm->pengeluaranCriteria->scale ?? 0,
            'tempat_tinggal' => $rtm->tempatTinggalCriteria->scale ?? 0,
            'status_kepemilikan_rumah' => $rtm->statusKepemilikanRumahCriteria->scale ?? 0,
            'kondisi_rumah' => $rtm->kondisiRumahCriteria->scale ?? 0,
            'aset' => $rtm->asetYangDimilikiCriteria->scale ?? 0,
            'transportasi' => $rtm->transportasiCriteria->scale ?? 0,
            'penerangan' => $rtm->peneranganRumahCriteria->scale ?? 0,
        ]);

        $criteriaWeights = collect([
            'penghasilan' => $rtm->penghasilanCriteria->weight ?? 0,
            'pengeluaran' => $rtm->pengeluaranCriteria->weight ?? 0,
            'tempat_tinggal' => $rtm->tempatTinggalCriteria->weight ?? 0,
            'status_kepemilikan_rumah' => $rtm->statusKepemilikanRumahCriteria->weight ?? 0,
            'kondisi_rumah' => $rtm->kondisiRumahCriteria->weight ?? 0,
            'aset' => $rtm->asetYangDimilikiCriteria->weight ?? 0,
            'transportasi' => $rtm->transportasiCriteria->weight ?? 0,
            'penerangan' => $rtm->peneranganRumahCriteria->weight ?? 0,
        ]);
        
        $maxScale = $criteriaScales->max();
        
        $normalizedScales = $criteriaScales->map(function ($scale) use ($maxScale) {
            return $maxScale > 0 ? $scale / $maxScale : 0;
        });

        $sawScore = $normalizedScales->map(function ($value, $key) use ($criteriaWeights) {
            return $value * ($criteriaWeights[$key] ?? 0);
        })->sum();
        
        $wpScore = $normalizedScales->reduce(function ($carry, $value, $key) use ($criteriaWeights) {
            $weight = $criteriaWeights[$key] ?? 0;
            return $carry * pow($value > 0 ? $value : 0.0001, $weight);
        }, 1);
        
        return dd([
            'normalized_scales' => $normalizedScales,
            'weights' => $criteriaWeights,
            'saw_score' => $sawScore,
            'wp_score' => $wpScore,
        ]);

        $perPage = $request->get('per_page', 20);
        $perPage = in_array($perPage, [20, 30, 40, 50]) ? $perPage : 10;

        $search = $request->get('search');

        $query = Rtm::withAllCriteria();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('nik', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%');
            });
        }

        $rtms = $query->latest()->paginate($perPage);

        $rtms->appends($request->query());

        return Inertia::render('rtm/rtms', [
            'rtms' => $rtms,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        $criterias = Criteria::getAllGroupedByType();

        return Inertia::render('rtm/create', [
            'criterias' => $criterias
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:rtms,nik',
            'address' => 'nullable|string',
            'penghasilan_id' => 'required|exists:criterias,id',
            'pengeluaran_id' => 'required|exists:criterias,id',
            'tempat_tinggal_id' => 'required|exists:criterias,id',
            'status_kepemilikan_rumah_id' => 'required|exists:criterias,id',
            'kondisi_rumah_id' => 'required|exists:criterias,id',
            'aset_yang_dimiliki_id' => 'required|exists:criterias,id',
            'transportasi_id' => 'required|exists:criterias,id',
            'penerangan_rumah_id' => 'required|exists:criterias,id',
        ]);

        $validated['user_id'] = Auth::id();

        $rtm = Rtm::create($validated);

        ProcessCalculate::dispatch($rtm->id);

        return redirect()->back()->with('rtms/create')->with('success', 'Data rumah tangga miskin berhasil ditambahkan.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        $criterias = Criteria::getAllGroupedByType();
        $rtm = Rtm::withAllCriteria()->findOrFail($id);

        return Inertia::render('rtm/edit', [
            'criterias' => $criterias,
            'rtm' => $rtm,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $rtm = Rtm::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nik' => 'required|string|size:16|unique:rtms,nik,' . $rtm->id,
            'address' => 'nullable|string',
            'penghasilan_id' => 'required|exists:criterias,id',
            'pengeluaran_id' => 'required|exists:criterias,id',
            'tempat_tinggal_id' => 'required|exists:criterias,id',
            'status_kepemilikan_rumah_id' => 'required|exists:criterias,id',
            'kondisi_rumah_id' => 'required|exists:criterias,id',
            'aset_yang_dimiliki_id' => 'required|exists:criterias,id',
            'transportasi_id' => 'required|exists:criterias,id',
            'penerangan_rumah_id' => 'required|exists:criterias,id',
        ]);

        $rtm->update($validated);

        return redirect()->back()->with('rtms/edit')->with('success', 'Data rumah tangga miskin berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        //
    }
}
