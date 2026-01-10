<?php

use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\CompanyController as AdminCompanyController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OfferController as AdminOfferController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
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
    Route::middleware('admin')->prefix('admin')->name('admin.')->group(function () {
        // Dashboard
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        // Users
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [AdminUserController::class, 'show'])->name('users.show');
        Route::post('/users/{user}/approve', [AdminUserController::class, 'approve'])->name('users.approve');
        Route::post('/users/{user}/reject', [AdminUserController::class, 'reject'])->name('users.reject');
        Route::post('/users/bulk-approve', [AdminUserController::class, 'bulkApprove'])->name('users.bulk-approve');
        Route::post('/users/bulk-reject', [AdminUserController::class, 'bulkReject'])->name('users.bulk-reject');

        // Offers
        Route::get('/offers', [AdminOfferController::class, 'index'])->name('offers.index');
        Route::get('/offers/create', [AdminOfferController::class, 'create'])->name('offers.create');
        Route::post('/offers', [AdminOfferController::class, 'store'])->name('offers.store');
        Route::get('/offers/{slug}/edit', [AdminOfferController::class, 'edit'])->name('offers.edit');
        Route::put('/offers/{slug}', [AdminOfferController::class, 'update'])->name('offers.update');
        Route::delete('/offers/{slug}', [AdminOfferController::class, 'destroy'])->name('offers.destroy');
        Route::post('/offers/{slug}/toggle', [AdminOfferController::class, 'toggleActive'])->name('offers.toggle');

        // Applications
        Route::get('/applications', [AdminApplicationController::class, 'index'])->name('applications.index');
        Route::get('/applications/{application}', [AdminApplicationController::class, 'show'])->name('applications.show');
        Route::patch('/applications/{application}/status', [AdminApplicationController::class, 'updateStatus'])->name('applications.status');
        Route::post('/applications/{application}/interview', [AdminApplicationController::class, 'scheduleInterview'])->name('applications.interview');
        Route::post('/applications/{application}/notes', [AdminApplicationController::class, 'addNote'])->name('applications.notes');
        Route::post('/applications/bulk-status', [AdminApplicationController::class, 'bulkUpdateStatus'])->name('applications.bulk-status');

        // Companies
        Route::get('/companies', [AdminCompanyController::class, 'index'])->name('companies.index');
        Route::get('/companies/create', [AdminCompanyController::class, 'create'])->name('companies.create');
        Route::post('/companies', [AdminCompanyController::class, 'store'])->name('companies.store');
        Route::get('/companies/{company}/edit', [AdminCompanyController::class, 'edit'])->name('companies.edit');
        Route::put('/companies/{company}', [AdminCompanyController::class, 'update'])->name('companies.update');
        Route::delete('/companies/{company}', [AdminCompanyController::class, 'destroy'])->name('companies.destroy');
        Route::post('/companies/{company}/verify', [AdminCompanyController::class, 'toggleVerified'])->name('companies.verify');
        Route::post('/companies/{company}/logo', [AdminCompanyController::class, 'uploadLogo'])->name('companies.logo');
    });
});

require __DIR__.'/settings.php';

