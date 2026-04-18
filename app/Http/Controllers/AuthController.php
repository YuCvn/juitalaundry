<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    // 1. Menampilkan Halaman Login
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    // 2. Proses Data Login
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            // Mengambil role jika ada, kalau tidak ada default ke Administrator
            $role = Auth::user()->role ?? 'Administrator'; 
            
            return redirect()->intended('/dashboard')
                ->with('success', 'Selamat datang ' . $role); 
        }

        return back()->with('error', 'Username atau password yang Anda masukkan salah.')
                     ->onlyInput('username');
    }

    // 3. Fungsi Logout (INI YANG TADI HILANG DAN BIKIN ERROR)
    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login')->with('success', 'Berhasil logout dari sistem.');
    }

    // 4. Fungsi Ubah Password di Pengaturan
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:6', 'confirmed'],
        ], [
            'current_password.required' => 'Password lama harus diisi.',
            'new_password.required' => 'Password baru harus diisi.',
            'new_password.min' => 'Password baru minimal 6 karakter.',
            'new_password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $user = Auth::user();

        // Cek apakah password lama sesuai
        if (!Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Password lama yang Anda masukkan salah.',
            ]);
        }

        // Update password baru
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return back()->with('success', 'Password berhasil diperbarui!');
    }
}