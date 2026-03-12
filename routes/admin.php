<?php

use App\Http\Controllers\Admin\ApplicationController;
use App\Http\Controllers\Admin\CompanyController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OfferController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Routes for the admin panel. All routes here are prefixed with 'admin/'
| and protected by auth, verified, active, and admin middleware.
|
*/

// Dashboard
Route::get('/', DashboardController::class)->name('dashboard');

// Users Management
Route::controller(UserController::class)->prefix('users')->name('users.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/{user}', 'show')->name('show');
    Route::post('/{user}/approve', 'approve')->name('approve');
    Route::post('/{user}/reject', 'reject')->name('reject');
    Route::post('/bulk-approve', 'bulkApprove')->name('bulk-approve');
    Route::post('/bulk-reject', 'bulkReject')->name('bulk-reject');
});

// Offers Management
Route::controller(OfferController::class)->prefix('offers')->name('offers.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::post('/', 'store')->name('store');
    Route::get('/{slug}/edit', 'edit')->name('edit');
    Route::put('/{slug}', 'update')->name('update');
    Route::delete('/{slug}', 'destroy')->name('destroy');
    Route::post('/{slug}/toggle', 'toggleActive')->name('toggle');
});

// Applications Management
Route::controller(ApplicationController::class)->prefix('applications')->name('applications.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/{application}', 'show')->name('show');
    Route::patch('/{application}/status', 'updateStatus')->name('status');
    Route::post('/{application}/interview', 'scheduleInterview')->name('interview');
    Route::post('/{application}/notes', 'addNote')->name('notes');
    Route::post('/bulk-status', 'bulkUpdateStatus')->name('bulk-status');
});

// Companies Management
Route::controller(CompanyController::class)->prefix('companies')->name('companies.')->group(function () {
    Route::get('/', 'index')->name('index');
    Route::get('/create', 'create')->name('create');
    Route::post('/', 'store')->name('store');
    Route::get('/{company}/edit', 'edit')->name('edit');
    Route::put('/{company}', 'update')->name('update');
    Route::delete('/{company}', 'destroy')->name('destroy');
    Route::post('/{company}/verify', 'toggleVerified')->name('verify');
    Route::post('/{company}/logo', 'uploadLogo')->name('logo');
});
