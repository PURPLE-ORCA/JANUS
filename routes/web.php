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
    
Route::get('/approval-pending', function () {
    return Inertia::render('approval-pending');
})->name('approval.pending');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('candidate-profile', function () {
        return Inertia::render('profile/edit');
    })->name('candidate-profile');

    Route::get('my-applications', function () {
        return Inertia::render('applications/index');
    })->name('applications.index');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('admin/index');
        })->name('dashboard');

        Route::get('/users', function () {
            return Inertia::render('admin/users/index');
        })->name('users.index');

        Route::get('/offers', function () {
            return Inertia::render('admin/offers/index');
        })->name('offers.index');

        Route::get('/applications', function () {
            return Inertia::render('admin/applications/index');
        })->name('applications.index');
    });
});

require __DIR__.'/settings.php';
