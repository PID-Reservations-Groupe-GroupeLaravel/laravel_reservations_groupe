<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('price_show', function (Blueprint $table) {
            $table->id();

            $table->foreignId('price_id')
                ->constrained('prices')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('show_id')
                ->constrained('shows')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('price_show');
    }
};
