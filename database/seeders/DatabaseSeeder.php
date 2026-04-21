<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Buat Akun Admin
        User::create([
            'name' => 'Pemilik Laundry',
            'username' => 'admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Buat Akun Kasir
        User::create([
            'name' => 'Kasir Satu',
            'username' => 'kasir',
            'password' => Hash::make('password'),
            'role' => 'cashier',
        ]);
    }
}