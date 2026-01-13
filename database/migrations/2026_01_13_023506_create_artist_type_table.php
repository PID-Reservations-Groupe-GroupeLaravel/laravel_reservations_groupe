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
        Schema::create('artist_type', function (Blueprint $table) {
            $table->foreignId('artist_id')
                ->constrained('artists')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->foreignId('type_id')
                ->constrained('types')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->primary(['artist_id', 'type_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('artist_type');
    }
};
