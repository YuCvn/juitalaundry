<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Administrator Juita',
            'username' => 'admin',
            'password' => Hash::make('admin'), // Password di-enkripsi
        ]);
    }
}