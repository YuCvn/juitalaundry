<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_histories', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel memberships, jika member dihapus, riwayatnya ikut terhapus (cascade)
            $table->foreignId('membership_id')->constrained()->onDelete('cascade');
            $table->string('type'); // 'Pendaftaran Membership' atau 'Top-up Saldo'
            $table->decimal('nominal', 15, 2);
            $table->decimal('saldo_akhir', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_histories');
    }
};