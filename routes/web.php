<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');
    
Route::get('/offers', function () {
    return Inertia::render('offers/index');
})->name('offers.index');
    
Route::get('/offers/{slug}', function ($slug) {
    return Inertia::render('offers/show', ['slug' => $slug]);
})->name('offers.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
