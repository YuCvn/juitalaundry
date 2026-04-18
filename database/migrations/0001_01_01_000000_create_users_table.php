<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Ubah 'users' menjadi 'tb_admin' agar sesuai dengan Model User.php
        Schema::create('tb_admin', function (Blueprint $table) {
            // Gunakan id_admin sesuai rancangan di Model
            $table->id('id_admin'); 
            $table->string('username')->unique();
            $table->string('password');
            
            // INI PENAMBAHANNYA: Kolom role untuk membedakan hak akses
            $table->enum('role', ['Administrator', 'Kasir'])->default('Kasir'); 
            
            $table->rememberToken();
            // Kita hilangkan $table->timestamps(); karena di model kamu set false
        });

        // Biarkan tabel reset token dan session seperti bawaan aslinya
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->unsignedBigInteger('user_id')->nullable()->index(); 
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        // Pastikan nama drop sesuai dengan nama create
        Schema::dropIfExists('tb_admin');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
