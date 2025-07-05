<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use App\Models\Rtm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RtmController extends Controller
{
    public function index(Request $request)
    {
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

        Rtm::create($validated);

        return redirect()->back()->with('rtms/create')->with('success', 'Data rumah tangga miskin berhasil ditambahkan.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        return Inertia::render('rtm/edit');
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
