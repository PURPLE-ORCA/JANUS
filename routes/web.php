<?php

use App\Http\Controllers\Candidate\ApplicationController;
use App\Http\Controllers\Candidate\DashboardController;
use App\Http\Controllers\Candidate\ProfileController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes
Route::get('/', WelcomeController::class)->name('home');
Route::get('/offers', [OfferController::class, 'index'])->name('offers.index');
Route::get('/offers/{slug}', [OfferController::class, 'show'])->name('offers.show');

// Approval Pending (accessible to unapproved users)
Route::get('/approval-pending', function () {
    return Inertia::render('approval-pending');
})->middleware('auth')->name('approval.pending');

// Authenticated + Active User Routes
Route::middleware(['auth', 'verified', 'active'])->group(function () {
    // Candidate Dashboard
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Candidate Profile
    Route::get('candidate-profile', [ProfileController::class, 'edit'])->name('candidate-profile');
    Route::put('candidate-profile', [ProfileController::class, 'update'])->name('candidate-profile.update');
    Route::post('candidate-profile/resume', [ProfileController::class, 'uploadResume'])->name('candidate-profile.resume');
    Route::delete('candidate-profile/resume', [ProfileController::class, 'deleteResume'])->name('candidate-profile.resume.delete');

    // Candidate Applications
    Route::get('my-applications', [ApplicationController::class, 'index'])->name('applications.index');
    Route::post('applications', [ApplicationController::class, 'store'])->name('applications.store');
    Route::post('applications/{application}/withdraw', [ApplicationController::class, 'withdraw'])->name('applications.withdraw');

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

        Route::get('/offers/create', function () {
            return Inertia::render('admin/offers/create');
        })->name('offers.create');

        Route::get('/offers/{slug}/edit', function ($slug) {
            return Inertia::render('admin/offers/edit', ['slug' => $slug]);
        })->name('offers.edit');

        Route::get('/applications', function () {
            return Inertia::render('admin/applications/index');
        })->name('applications.index');
    });
});

require __DIR__.'/settings.php';
