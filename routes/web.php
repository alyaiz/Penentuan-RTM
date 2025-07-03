<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\RtmController;
use App\Http\Controllers\Admin\KriteriaController;
use App\Http\Controllers\Admin\HasilController;
use App\Http\Controllers\Admin\AdminController;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');


Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', fn() => view('admin.dashboard'))->name('dashboard');

    Route::get('/profil', [ProfileController::class, 'edit'])->name('profil.edit');
    Route::post('/profil', [ProfileController::class, 'update'])->name('profil.update');

    Route::resource('rtm', RtmController::class);

    Route::resource('kriteria', KriteriaController::class)->only(['index', 'edit', 'update']);

    Route::get('/hasil', [HasilController::class, 'index'])->name('hasil.index');
    Route::get('/hasil/pdf', [HasilController::class, 'exportPDF'])->name('hasil.pdf');

    Route::resource('users', AdminController::class)->except(['show']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
