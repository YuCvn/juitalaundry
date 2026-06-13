<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->string('full_name'); 
            $table->string('phone_number')->unique(); 
            $table->text('address')->nullable(); 
            $table->decimal('balance', 15, 2)->default(0); 
            $table->integer('loyalty_point')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};