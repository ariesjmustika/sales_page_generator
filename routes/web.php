<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\SalesPageController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [SalesPageController::class, 'index'])->name('dashboard');
    Route::post('/sales-pages', [SalesPageController::class, 'store'])->name('sales-pages.store');
    Route::get('/sales-pages/{salesPage}', [SalesPageController::class, 'show'])->name('sales-pages.show');
    Route::post('/sales-pages/{salesPage}/regenerate', [SalesPageController::class, 'regenerate'])->name('sales-pages.regenerate');
    Route::post('/sales-pages/{salesPage}/theme', [SalesPageController::class, 'updateTheme'])->name('sales-pages.update-theme');
    Route::post('/sales-pages/{salesPage}/update-copy', [SalesPageController::class, 'updateCopy'])->name('sales-pages.update-copy');
    Route::delete('/sales-pages/{salesPage}', [SalesPageController::class, 'destroy'])->name('sales-pages.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
