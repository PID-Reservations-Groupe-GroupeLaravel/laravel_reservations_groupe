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
        Schema::create('shows', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 60)->unique();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->string('poster_url', 255)->nullable();
            $table->unsignedSmallInteger('duration');
            $table->year('created_in');
            $table->foreignId('location_id')->nullable();
            $table->boolean('bookable')->default(false);

            // timestamps custom (comme dans le PDF)
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('location_id')
                ->references('id')
                ->on('locations')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shows');
    }
};
