<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\KasirController;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);
});

Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware('auth')->name('dashboard');

Route::get('/orders', function () {
    return Inertia::render('Orders');
})->middleware('auth')->name('orders');

Route::get('/orders/create', function () {
    return Inertia::render('CreateOrder'); 
})->middleware('auth')->name('orders.create');

Route::get('/history', function () {
    return Inertia::render('History');
})->middleware('auth')->name('history');

Route::get('/membership', function () {
    return Inertia::render('Membership');
})->middleware('auth')->name('membership');

Route::get('/laporan-keuangan', function () {
    return Inertia::render('LaporanKeuangan');
})->middleware('auth')->name('laporan-keuangan');

Route::get('/pengeluaran', function () { 
    return Inertia::render('Pengeluaran');
})->middleware('auth')->name('pengeluaran');

Route::get('/pengaturan', function () {
    return Inertia::render('Pengaturan');
})->middleware('auth')->name('pengaturan');

Route::put('/pengaturan/password', [AuthController::class, 'updatePassword'])->middleware('auth')->name('password.update');