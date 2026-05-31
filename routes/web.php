<?php

use Illuminate\Support\Facades\Route;
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
use App\Http\Controllers\Cashier\DashboardController as CashierDashboard;
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
        
        Route::get('/dashboard', [AdminDashboard::class, 'index'])->name('dashboard');
        
        // Keuangan
        Route::get('/financial-reports', [FinancialReportController::class, 'index'])->name('financial-reports.index');
        // Laporan Keuangan
        Route::get('/laporan-keuangan', [\App\Http\Controllers\Admin\FinancialReportController::class, 'index'])->name('admin.report.index');
        Route::get('/expenses', [ExpenseController::class, 'index'])->name('expenses.index');

        // Kelola Layanan
        Route::resource('services', ServiceController::class)->except(['create', 'show', 'edit']);
        
        // Kelola Kasir
        Route::get('/cashiers', [CashierController::class, 'index'])->name('cashiers.index');
        Route::post('/cashiers', [CashierController::class, 'store'])->name('cashiers.store');
        Route::patch('/cashiers/{id}/toggle', [CashierController::class, 'toggleStatus'])->name('cashiers.toggle');
        Route::put('/cashiers/{id}', [CashierController::class, 'update'])->name('cashiers.update');
        Route::delete('/cashiers/{id}', [CashierController::class, 'destroy'])->name('cashiers.destroy');

        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings/password', [SettingController::class, 'updatePassword'])->name('settings.password.update');
        // Tambahkan ini di dalam group route Admin
        Route::get('/pengeluaran', [\App\Http\Controllers\Admin\ExpenseController::class, 'index'])->name('admin.expense.index');
        Route::post('/pengeluaran', [\App\Http\Controllers\Admin\ExpenseController::class, 'store'])->name('admin.expense.store');
        Route::delete('/pengeluaran/{expense}', [\App\Http\Controllers\Admin\ExpenseController::class, 'destroy'])->name('admin.expense.destroy');
    });

    // AREA KASIR (CASHIER)

    Route::prefix('cashier')->name('cashier.')->middleware('role:cashier')->group(function () {
        
        Route::get('/dashboard', [CashierDashboard::class, 'index'])->name('dashboard');
        
        // Transaksi
        Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
        Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        
        // TAMBAHKAN BARIS INI TEPAT DI BAWAHNYA:
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