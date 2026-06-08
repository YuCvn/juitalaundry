<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_reports', function (Blueprint $table) {
            $table->id();
            $table->string('keterangan'); 
            $table->decimal('nominal', 15, 2);
            $table->date('tanggal');
            
            // OPSIONAL: Jika tabel ini murni menggantikan expense, abaikan baris di bawah.
            // Namun jika ingin lebih fleksibel, Anda bisa menambahkan kolom jenis transaksi.
            // $table->enum('jenis', ['pemasukan', 'pengeluaran'])->default('pengeluaran'); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_reports');
    }
};