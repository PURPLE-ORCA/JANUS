<?php

use App\Http\Controllers\OfferController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Public routes accessible to all users. For authenticated routes, see:
| - routes/candidate.php (candidate portal)
| - routes/admin.php (admin panel)
|
*/

// Homepage
Route::get('/', WelcomeController::class)->name('home');

// Public Offers
Route::get('/offers', [OfferController::class, 'index'])->name('offers.index');
Route::get('/offers/{slug}', [OfferController::class, 'show'])->name('offers.show');

// Approval Pending (for users awaiting approval)
Route::get('/approval-pending', function () {
    return Inertia::render('approval-pending');
})->middleware('auth')->name('approval.pending');

// Include authenticated route files
require __DIR__.'/candidate.php';
require __DIR__.'/settings.php';
