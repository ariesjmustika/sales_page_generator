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

// TEMPORARY SEEDER ROUTE
Route::get('/seed-database', function() {
    try {
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
        return "Database Seeded Successfully! Akun demo: demo@marketai.com / demo123456.";
    } catch (\Exception $e) {
        return "Error Seeding: " . $e->getMessage();
    }
});

Route::get('/v/{uuid}', [SalesPageController::class, 'publicShow'])->name('sales-pages.public');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [SalesPageController::class, 'index'])->name('dashboard');
    Route::post('/sales-pages', [SalesPageController::class, 'store'])->name('sales-pages.store');
    Route::get('/sales-pages/{salesPage:uuid}', [SalesPageController::class, 'show'])->name('sales-pages.show');
    Route::post('/sales-pages/{salesPage:uuid}/regenerate', [SalesPageController::class, 'regenerate'])->name('sales-pages.regenerate');
    Route::post('/sales-pages/{salesPage:uuid}/theme', [SalesPageController::class, 'updateTheme'])->name('sales-pages.update-theme');
    Route::post('/sales-pages/{salesPage:uuid}/update-copy', [SalesPageController::class, 'updateCopy'])->name('sales-pages.update-copy');
    Route::post('/sales-pages/{salesPage:uuid}/update-settings', [SalesPageController::class, 'updateSettings'])->name('sales-pages.update-settings');
    Route::post('/sales-pages/{salesPage:uuid}/image-style', [SalesPageController::class, 'updateImageStyle'])->name('sales-pages.image-style');
    Route::post('/sales-pages/{salesPage:uuid}/regenerate-image', [SalesPageController::class, 'regenerateImage'])->name('sales-pages.regenerate-image');
    Route::post('/sales-pages/{salesPage:uuid}/magic-rewrite', [SalesPageController::class, 'magicRewrite'])->name('sales-pages.magic-rewrite');
    Route::delete('/sales-pages/{salesPage:uuid}', [SalesPageController::class, 'destroy'])->name('sales-pages.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
