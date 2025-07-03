<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SAW;
use App\Models\WP;

class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        $method = $request->input('metode', 'saw');
        $data = collect();

        if ($method === 'saw') {
            $data = SAW::with('rtm')->orderByDesc('score')->get();
        } else {
            $data = WP::with('rtm')->orderByDesc('score')->get();
        }

        return view('welcome', compact('data', 'method'));
    }
}
