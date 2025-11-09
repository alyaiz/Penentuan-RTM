<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\PublicResultController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CriteriaController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\ResultPublicController;
use App\Http\Controllers\RtmController;
use App\Http\Controllers\RtmImportController;
use App\Http\Controllers\UserController;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::prefix('publik')->name('public.')->group(function () {
    Route::get('/hasil/pdf', [ResultPublicController::class, 'exportPdf'])->name('hasil.pdf');
    Route::get('/hasil/excel', [ResultPublicController::class, 'exportExcel'])->name('hasil.excel');
    Route::resource('hasil', ResultPublicController::class);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('admin', UserController::class)->middleware(['is_super_admin']);

    Route::resource('rumah-tangga-miskin', RtmController::class);
    Route::post('/rumah-tangga-miskin/import', [RtmImportController::class, 'import'])->name('rumah-tangga-miskin.import');

    Route::prefix('kriteria')->name('kriteria.')->group(function () {
        Route::get('ambil-bobot', [CriteriaController::class, 'getWeights'])->name('kriteria.ambil-bobot');
        Route::put('update-bobot', [CriteriaController::class, 'updateWeights'])->name('kriteria.update-bobot');
    });
    Route::resource('kriteria', CriteriaController::class);

    Route::prefix('hasil')->name('hasil.')->group(function () {
        Route::post('/hitung', [ResultController::class, 'calculateResults'])->name('hitung');
        Route::get('/pdf', [ResultController::class, 'exportPdf'])->name('pdf');
        Route::get('/excel', [ResultController::class, 'exportExcel'])->name('excel');

        Route::prefix('sensitivitas')->name('sensitivitas.')->group(function () {
            Route::get('/pdf', [ResultController::class, 'exportMcrPdf'])->name('pdf');
            Route::get('/excel', [ResultController::class, 'exportMcrExcel'])->name('excel');
        });
    });
    Route::resource('hasil', ResultController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
