<?php

namespace App\Http\Controllers;

use App\Models\User; // Menggunakan model User yang terhubung ke tb_admin
use Illuminate\Http\Request;
use Inertia\Inertia;

class KasirController extends Controller
{
    // Menampilkan halaman Kelola Kasir beserta datanya
    public function index()
    {
        // Mengambil semua data pengguna (Administrator & Kasir) dari database
        $kasir = User::all();

        return Inertia::render('KelolaKasir', [
            'kasir' => $kasir
        ]);
    }

    // Fungsi Tambah, Edit, dan Hapus akan kita tambahkan setelah halamannya muncul
}