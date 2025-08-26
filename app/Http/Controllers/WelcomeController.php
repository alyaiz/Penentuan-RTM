<?php

namespace App\Http\Controllers;

class WelcomeController extends Controller
{
    public function index()
    {
        $desa = (object)[
            'deskripsi'         => 'Selamat datang di portal desa.',
            'jumlah_kk'         => null,
            'jumlah_kk_miskin'  => null,
            'hero_image'        => null,
        ];

        return view('public.welcome', compact('desa'));
    }
}
