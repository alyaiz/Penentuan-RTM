<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SAW;
use App\Models\WP;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('welcome');
    }
}
