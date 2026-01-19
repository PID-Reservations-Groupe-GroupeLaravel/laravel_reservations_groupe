<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artist_type_show', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('artist_type_id');
            $table->unsignedBigInteger('show_id');

            $table->foreign('artist_type_id')
                ->references('id')
                ->on('artist_type')
                ->onDelete('restrict')
                ->onUpdate('cascade');

            $table->foreign('show_id')
                ->references('id')
                ->on('shows')
                ->onDelete('restrict')
                ->onUpdate('cascade');

            // évite les doublons
            $table->unique(['artist_type_id', 'show_id'], 'artist_type_show_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artist_type_show');
    }
};
