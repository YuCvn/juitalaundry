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
            $table->string('order_id')->unique(); 
            $table->foreignId('membership_id')->nullable()->constrained('memberships')->nullOnDelete();
            

            $table->string('customer_name');
            $table->string('phone_number');
            $table->text('address')->nullable();
            $table->timestamp('order_date')->useCurrent();
            

            $table->string('pickup_method')->default('pickup');
            $table->decimal('delivery_distance', 8, 2)->default(0);
            $table->decimal('delivery_fee', 15, 2)->default(0);
            

            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('discount', 15, 2)->default(0);
            $table->decimal('total_price', 15, 2)->default(0);
            

            $table->string('payment_method');
            $table->enum('status', ['pending', 'processing', 'completed', 'picked_up'])->default('pending');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};