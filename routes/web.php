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
use App\Http\Controllers\RtmController;
use App\Http\Controllers\UserController;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/publik/hasil', [PublicResultController::class, 'index'])->name('public.hasil');
Route::get('/publik/hasil/pdf', [PublicResultController::class, 'exportPdf'])->name('public.hasil.pdf');

Route::middleware(['auth','verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('pengguna', UserController::class)->middleware(['is_super_admin']);
    Route::resource('rumah-tangga-miskin', RtmController::class);

    Route::get('kriteria/ambil-bobot', [CriteriaController::class, 'getWeights']);
    Route::put('kriteria/update-bobot', [CriteriaController::class, 'updateWeights']);
    Route::resource('kriteria', CriteriaController::class);

    Route::get('/hasil', [HasilController::class, 'index'])->name('hasil.index');
    Route::get('/hasil/pdf', [HasilController::class, 'exportPDF'])->name('hasil.pdf');
    Route::get('/hasil/excel', [HasilController::class, 'exportExcel'])->name('hasil.excel');

    Route::get('/hasil/sensitivitas', [HasilController::class, 'sensitivitas'])->name('hasil.sens');
    Route::get('/hasil/mcr/pdf', [HasilController::class, 'exportMCRPDF'])->name('hasil.mcr.pdf');
    Route::get('/hasil/mcr/excel', [HasilController::class, 'exportMCRExcel'])->name('hasil.mcr.excel');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
