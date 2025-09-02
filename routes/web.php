<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\BorrowerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PatrolBaseController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::middleware(['role:Admin'])->group(function () {
        Route::resource('users', UserController::class);
        Route::resource('loans', LoanController::class);

        Route::controller(LoanController::class)->group(function () {
            Route::put('/loans/{loan}/approve', 'approve')->name('loans.approve');
        });

        Route::controller(PaymentController::class)->group(function () {
            Route::get('/payments', 'index')->name('payments.index');
            Route::get('/payments/create', 'create')->name('payments.create');
            Route::post('/payments', 'store')->name('payments.store');
        });

        Route::controller(BorrowerController::class)->group(function () {
            Route::get('/borrowers', 'index')->name('borrowers.index');
            Route::post('/borrowers', 'store')->name('borrowers.store');
        });

        Route::controller(ReportController::class)->group(function () {
            Route::get('/reports', 'index')->name('reports.index');
        });

        Route::controller(AnalyticsController::class)->group(function () {
            Route::get('/analytics', 'index')->name('analytics.index');
        });

        Route::resource('members', MemberController::class);
        Route::resource('patrol-bases', PatrolBaseController::class);
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';