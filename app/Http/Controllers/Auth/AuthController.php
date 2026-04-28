<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            $user = Auth::user();

            if (isset($user->is_active) && !$user->is_active) {
                Auth::logout();
                return back()->with('error', 'Akun Anda telah dinonaktifkan oleh Administrator. Hubungi atasan Anda.');
            }
            $request->session()->regenerate();

            $role = Auth::user()->role; 
            
            if (strtolower($role) === 'administrator' || strtolower($role) === 'admin') {
                return redirect()->intended(route('admin.dashboard'))
                    ->with('success', 'Selamat datang kembali, Admin!');
            } elseif (strtolower($role) === 'kasir' || strtolower($role) === 'cashier') {
                return redirect()->intended(route('cashier.orders.create'))
                    ->with('success', 'Selamat bekerja, Kasir!');
            }

            return redirect()->intended('/')->with('success', 'Selamat datang!'); 
        }

        return back()->with('error', 'Username atau password yang Anda masukkan salah.')
                     ->onlyInput('username');
    }

    // 3. Fungsi Logout
    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Berhasil logout dari sistem.');
    }
}