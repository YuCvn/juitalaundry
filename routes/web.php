<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// 1. Tambahkan rute utama ini:
// Jika user buka web utama, langsung arahkan ke halaman login
Route::get('/', function () {
    return redirect()->route('login');
});

// (Kode yang sebelumnya sudah kita buat di bawahnya)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);
});

Route::post('/logout', [AuthController::class, 'destroy'])->middleware('auth')->name('logout');

// Pastikan ini benar
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard'); // HARUS pakai Inertia::render
})->middleware('auth')->name('dashboard');

Route::get('/orders', function () {
    return Inertia::render('Orders');
})->middleware('auth')->name('orders');

Route::get('/orders/create', function () {
    return Inertia::render('CreateOrder'); // Sesuai nama file kita tadi
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

// Tambahkan juga route sementara untuk Pengeluaran & Pengaturan agar tidak error 404 saat di-klik
Route::get('/pengeluaran', function () { 
    return Inertia::render('Pengeluaran'); // Sekarang memanggil file Pengeluaran.jsx
})->middleware('auth')->name('pengeluaran');

Route::get('/pengaturan', function () {
    return Inertia::render('Pengaturan');
})->middleware('auth')->name('pengaturan');
