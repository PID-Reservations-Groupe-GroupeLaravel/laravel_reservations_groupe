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
        Schema::create('localities', function (Blueprint $table) {
            $table->string('postal_code', 10);
            $table->string('locality', 60);

            $table->primary('postal_code');

            // $table->timestamps(); // PAS de timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('localities');
    }
};
