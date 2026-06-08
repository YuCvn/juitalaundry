<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

// Auth
use App\Http\Controllers\Auth\AuthController;

// Admin Controllers
use App\Http\Controllers\Admin\DashboardController as AdminDashboard;
use App\Http\Controllers\Admin\FinancialReportController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\Admin\CashierController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ServiceController;

// Cashier Controllers
use App\Http\Controllers\Cashier\DashboardController;
use App\Http\Controllers\Cashier\OrderController;
use App\Http\Controllers\Cashier\HistoryController;
use App\Http\Controllers\Cashier\MembershipController;


// Route Default
Route::get('/', function () {
    if (Auth::check()) {
        $role = strtolower(Auth::user()->role);
        if ($role === 'admin' || $role === 'administrator') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('cashier.orders.index'); 
    }
    return redirect()->route('login');
});

// Route Guest
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);
});

// Route Auth
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        $role = strtolower(Auth::user()->role);
        if ($role === 'admin' || $role === 'administrator') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('cashier.orders.index');
    })->name('dashboard.redirect');
    
    // Rute Logout
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // AREA ADMIN
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {

        // Dashboard 
        Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard');
        
        //Keuangan
        Route::get('/financial-reports', [FinancialReportController::class, 'index'])->name('financial-reports.index');
        Route::get('/expenses', [ExpenseController::class, 'index'])->name('expenses.index');
        Route::post('/expenses', [ExpenseController::class, 'store'])->name('expenses.store');
        Route::put('/expenses/{id}', [ExpenseController::class, 'update'])->name('expenses.update');
        Route::delete('/expenses/{id}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');

        // Kelola Layanan
        Route::resource('services', ServiceController::class)->except(['create', 'show', 'edit']);
        
        // Kelola Kasir
        Route::get('/cashiers', [CashierController::class, 'index'])->name('cashiers.index');
        Route::post('/cashiers', [CashierController::class, 'store'])->name('cashiers.store');
        Route::patch('/cashiers/{id}/toggle', [CashierController::class, 'toggleStatus'])->name('cashiers.toggle');
        Route::put('/cashiers/{id}', [CashierController::class, 'update'])->name('cashiers.update');
        Route::delete('/cashiers/{id}', [CashierController::class, 'destroy'])->name('cashiers.destroy');

    });

    // AREA KASIR (CASHIER)
    Route::prefix('cashier')->name('cashier.')->middleware('role:cashier')->group(function () {
        
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        
        // Transaksi
        Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
        
        // Riwayat & Pelanggan
        Route::get('/history', [HistoryController::class, 'index'])->name('history.index');
        
        // Kelola Membership
        Route::get('/membership', [MembershipController::class, 'index'])->name('membership.index');
        Route::post('/membership', [MembershipController::class, 'store'])->name('membership.store');
        Route::put('/membership/{membership}', [MembershipController::class, 'update'])->name('membership.update');
        Route::delete('/membership/{membership}', [MembershipController::class, 'destroy'])->name('membership.destroy');
    });

});