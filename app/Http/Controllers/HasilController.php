<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SAW;
use App\Models\WP;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class HasilController extends Controller
{
    public function index(Request $request)
    {
        $method = $request->input('metode', 'saw');

        if ($method === 'saw') {
            $data = SAW::with('rtm')->orderByDesc('score')->get();
        } else {
            $data = WP::with('rtm')->orderByDesc('score')->get();
        }

        return view('admin.hasil.index', compact('data', 'method'));
    }

    public function exportPDF(Request $request)
    {
        $method = $request->input('metode', 'saw');

        if ($method === 'saw') {
            $data = SAW::with('rtm')->orderByDesc('score')->get();
        } else {
            $data = WP::with('rtm')->orderByDesc('score')->get();
        }

        $pdf = Pdf::loadView('admin.hasil.pdf', compact('data', 'method'));

        return $pdf->download('hasil-perhitungan-' . strtoupper($method) . '.pdf');
    }
}
