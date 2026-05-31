<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // Contoh: ORD-20260531-001
            $table->foreignId('membership_id')->nullable()->constrained('memberships')->nullOnDelete();
            $table->string('nama');
            $table->string('nomor_telepon');
            $table->text('alamat')->nullable();
            
            $table->timestamp('tanggal_order')->useCurrent();
            
            // Detail Pengiriman (diambil dari frontend)
            $table->string('metode_pengambilan')->default('ambil'); // ambil / antar
            $table->decimal('jarak_pengiriman', 8, 2)->default(0);
            $table->decimal('biaya_ongkir', 15, 2)->default(0);
            
            // Kalkulasi Harga
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('diskon', 15, 2)->default(0);
            $table->decimal('total_harga', 15, 2)->default(0);
            
            $table->string('metode_pembayaran'); // langsung / nanti
            $table->enum('status_order', ['menunggu', 'dalam proses', 'selesai', 'sudah diambil'])->default('menunggu');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};