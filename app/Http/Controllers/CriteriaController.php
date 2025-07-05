<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CriteriaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        $query = Criteria::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('type', 'like', '%' . $search . '%');
            });
        }

        $criterias = $query->orderBy('id')->get();

        return Inertia::render('criterias', [
            'criterias' => $criterias,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function show(Criteria $criteria)
    {
        //
    }

    public function edit(Criteria $criteria)
    {
        //
    }

    public function update(Request $request, Criteria $criteria)
    {
        //
    }

    public function destroy(Criteria $criteria)
    {
        //
    }

    public function getWeights()
    {
        $criterias = Criteria::all();

        $weights = $criterias->groupBy('type')->map(function ($group) {
            return $group->first()->weight;
        });

        Log::info('Memanggil editWeights', [
            'total_criterias' => $criterias->count(),
            'weights' => $weights,
        ]);

        return response()->json([
            'weights' => $weights,
        ]);
    }

    public function updateWeights(Request $request)
    {
        $validated = $request->validate([
            'penghasilan' => 'required|numeric',
            'pengeluaran' => 'required|numeric',
            'tempat_tinggal' => 'required|numeric',
            'status_kepemilikan_rumah' => 'required|numeric',
            'kondisi_rumah' => 'required|numeric',
            'aset_yang_dimiliki' => 'required|numeric',
            'transportasi' => 'required|numeric',
            'penerangan_rumah' => 'required|numeric',
        ]);

        DB::beginTransaction();

        try {
            foreach ($validated as $type => $weight) {
                Criteria::where('type', $type)->update([
                    'weight' => $weight,
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Data bobot berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus pengguna.');
        }
    }
}
