<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('representations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('show_id')
                ->constrained('shows')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('location_id')
                ->constrained('locations')
                ->cascadeOnUpdate()
                ->restrictOnDelete();

            $table->dateTime('schedule');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('representations');
    }
};
