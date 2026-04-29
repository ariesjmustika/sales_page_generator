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
        Schema::table('sales_pages', function (Blueprint $table) {
            $table->string('image_style')->default('cinematic')->after('theme');
            $table->unsignedInteger('image_seed')->default(1)->after('image_style');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_pages', function (Blueprint $table) {
            $table->dropColumn(['image_style', 'image_seed']);
        });
    }
};
