<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\KriteriaController;
use App\Http\Controllers\Admin\HasilController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\RtmController;
use App\Http\Controllers\UserController;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('pengguna', UserController::class);
    Route::resource('rumah-tangga-miskin', RtmController::class);

    Route::get('/kriteria/ambil-bobot', [CriteriaController::class, 'getWeights']);
    Route::put('/kriteria/update-bobot', [CriteriaController::class, 'updateWeights']);
    Route::resource('kriteria', CriteriaController::class);
});

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    // Route::get('/dashboard', fn() => view('admin.dashboard'))->name('dashboard');

    // Route::get('/profil', [ProfileController::class, 'edit'])->name('profil.edit');
    // Route::post('/profil', [ProfileController::class, 'update'])->name('profil.update');

    // Route::resource('rtm', RtmController::class);

    // Route::resource('kriteria', KriteriaController::class)->only(['index', 'edit', 'update']);

    // Route::get('/hasil', [HasilController::class, 'index'])->name('hasil.index');
    // Route::get('/hasil/pdf', [HasilController::class, 'exportPDF'])->name('hasil.pdf');

    // Route::resource('users', AdminController::class)->except(['show']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
