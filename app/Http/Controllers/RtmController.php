<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RumahTanggaMiskin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RtmController extends Controller
{
    public function index()
    {
        $data = RumahTanggaMiskin::where('admin_id', Auth::id())->get();
        return view('admin.rtm.index', compact('data'));
    }

    public function create()
    {
        return view('admin.rtm.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required',
            'nama' => 'required',
        ]);

        $validated['admin_id'] = Auth::id();

        RumahTanggaMiskin::create($validated);

        return redirect()->route('admin.rtm.index')->with('success', 'Data berhasil ditambahkan.');
    }

    public function edit(RumahTanggaMiskin $rtm)
    {
        return view('admin.rtm.edit', compact('rtm'));
    }

    public function update(Request $request, RumahTanggaMiskin $rtm)
    {
        $validated = $request->validate([
            'nik' => 'required',
            'nama' => 'required',
        ]);

        $rtm->update($validated);

        return redirect()->route('admin.rtm.index')->with('success', 'Data berhasil diupdate.');
    }

    public function destroy(RumahTanggaMiskin $rtm)
    {
        $rtm->delete();
        return back()->with('success', 'Data berhasil dihapus.');
    }
}
