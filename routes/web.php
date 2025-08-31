<?php

use App\Http\Controllers\LoanController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    Route::middleware(['role:admin'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::resource('loans', LoanController::class);

        Route::controller(LoanController::class)->group(function () {
            Route::put('/loans/{loan}/approve', 'approve')->name('loans.approve');
        });

        Route::controller(PaymentController::class)->group(function () {
            Route::get('/payments', 'index')->name('payments.index');
            Route::get('/payments/create', 'create')->name('payments.create');
            Route::post('/payments', 'store')->name('payments.store');
        });
        
        Route::resource('members', MemberController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';