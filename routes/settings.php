<?php

use App\Http\Controllers\Settings\CalculateController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('pengaturan', 'pengaturan/profile');

    Route::get('pengaturan/profil', [ProfileController::class, 'edit'])->name('profil.edit');
    Route::patch('pengaturan/profil', [ProfileController::class, 'update'])->name('profil.update');
    Route::delete('pengaturan/profil', [ProfileController::class, 'destroy'])->name('profil.destroy');

    Route::get('pengaturan/hitung', [CalculateController::class, 'edit'])->name('hitung.edit');
    Route::put('pengaturan/hitung', [CalculateController::class, 'update'])->name('hitung.update');

    Route::get('pengaturan/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('pengaturan/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('pengaturan/tampilan', function () {
        return Inertia::render('settings/appearance');
    })->name('tampilan');
});
