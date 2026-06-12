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
        Schema::table('orders', function (Blueprint $table) {
            $table->index(['status', 'updated_at']);
            $table->index('membership_id');
        });

        Schema::table('financial_reports', function (Blueprint $table) {

            $table->index('date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status', 'updated_at']);
            $table->dropIndex(['membership_id']);
        });

        Schema::table('financial_reports', function (Blueprint $table) {
            $table->dropIndex(['date']);
        });
    }
};