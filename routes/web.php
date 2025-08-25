<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\PublicResultController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\KriteriaController;
use App\Http\Controllers\Admin\HasilController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\RtmController;
use App\Http\Controllers\UserController;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/publik/hasil', [PublicResultController::class, 'index'])->name('public.hasil');
Route::get('/publik/hasil/pdf', [PublicResultController::class, 'exportPdf'])->name('public.hasil.pdf');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('pengguna', UserController::class)->middleware(['is_super_admin']);
    Route::resource('rumah-tangga-miskin', RtmController::class);

    Route::get('kriteria/ambil-bobot', [CriteriaController::class, 'getWeights']);
    Route::put('kriteria/update-bobot', [CriteriaController::class, 'updateWeights']);
    Route::resource('kriteria', CriteriaController::class);

    Route::get('/hasil', [ResultController::class, 'index'])->name('hasil.index');
    Route::post('/hasil/hitung', [ResultController::class, 'calculateResults'])->name('hasil.hitung');
    Route::get('/hasil/pdf', [ResultController::class, 'exportPdf'])->name('hasil.pdf');
    Route::get('/hasil/excel', [ResultController::class, 'exportExcel'])->name('hasil.excel');
    Route::get('/hasil/sensitivitas/pdf', [ResultController::class, 'exportMcrPdf'])->name('hasil.sensitivitas.pdf');
    Route::get('/hasil/sensitivitas/excel', [ResultController::class, 'exportMcrExcel'])->name('hasil.sensitivitas.excel');

    // Route::get('/hasil/sensitivitas', [HasilController::class, 'sensitivitas'])->name('hasil.sens');
    // Route::get('/hasil/mcr/pdf', [HasilController::class, 'exportMCRPDF'])->name('hasil.mcr.pdf');
    // Route::get('/hasil/mcr/excel', [HasilController::class, 'exportMCRExcel'])->name('hasil.mcr.excel');

    Route::get('/result', [HasilController::class, 'index'])->name('result.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
