<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
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
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active; 
        $user->save();

        if ($user->is_active) {
            return back()->with('success', 'Akun Kasir Diaktifkan|Akses login untuk kasir ' . $user->name . ' telah dibuka kembali.');
        } else {
            return back()->with('error', 'Akun Kasir Dinonaktifkan|Akses login untuk kasir ' . $user->name . ' telah ditutup sementara.');
        }
    }
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6|confirmed',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'username.required' => 'Username wajib diisi.',
            'username.unique' => 'Username ini sudah digunakan, pilih yang lain.',
            'password.min' => 'Password minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $user->name = $request->name;
        $user->username = $request->username;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return back()->with('success', 'Akun Diperbarui|Data kasir ' . $user->name . ' berhasil disimpan.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $namaKasir = $user->name;
        $user->delete();

        return back()->with('success', 'Akun Dihapus|Data kasir ' . $namaKasir . ' telah dihapus secara permanen.');
    }
}