<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Jangan lupa import Hash
use Inertia\Inertia;

class CashierController extends Controller
{
    public function index()
    {
        $cashiers = User::where('role', '!=', 'admin')->get();

        return Inertia::render('Admin/Cashier', [
            'cashiers' => $cashiers
        ]);
    }

    // FUNGSI BARU: Untuk menyimpan data kasir
    public function store(Request $request)
    {
        // 1. Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username ini sudah digunakan, pilih yang lain.',
            'password.required' => 'Password wajib diisi.',
            'password.min' => 'Password minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => 'cashier',
        ]);
        return back()->with('success', 'Kasir baru berhasil ditambahkan!');
    }
}