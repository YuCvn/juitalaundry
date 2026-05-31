<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->string('keterangan'); // Contoh: Beli deterjen, Bayar listrik
            $table->decimal('nominal', 15, 2); // Jumlah uang keluar
            $table->date('tanggal'); // Tanggal pengeluaran
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};