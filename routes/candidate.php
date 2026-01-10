<?php

use App\Http\Controllers\Candidate\ApplicationController;
use App\Http\Controllers\Candidate\DashboardController;
use App\Http\Controllers\Candidate\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Candidate Routes
|--------------------------------------------------------------------------
|
| Routes for authenticated candidates. All routes here are protected by
| auth, verified, and active middleware.
|
*/

Route::middleware(['auth', 'verified', 'active'])->group(function () {
    // Dashboard
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // Profile Management
    Route::controller(ProfileController::class)->name('candidate-profile')->group(function () {
        Route::get('candidate-profile', 'edit');
        Route::put('candidate-profile', 'update')->name('.update');
        Route::post('candidate-profile/resume', 'uploadResume')->name('.resume');
        Route::delete('candidate-profile/resume', 'deleteResume')->name('.resume.delete');
    });

    // Applications
    Route::controller(ApplicationController::class)->group(function () {
        Route::get('my-applications', 'index')->name('applications.index');
        Route::post('applications', 'store')->name('applications.store');
        Route::post('applications/{application}/withdraw', 'withdraw')->name('applications.withdraw');
    });
});

