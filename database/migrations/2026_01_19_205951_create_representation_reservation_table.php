<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('representation_reservation', function (Blueprint $table) {
            $table->foreignId('representation_id')->constrained('representations')->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignId('reservation_id')->constrained('reservations')->cascadeOnUpdate()->restrictOnDelete();

            $table->decimal('unit_price', 10, 2);
            $table->unsignedTinyInteger('quantity')->default(1);

            $table->timestamps();

            // (optionnel mais recommandé) évite les doublons representation/reservation
            $table->unique(['representation_id', 'reservation_id'], 'rep_res_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('representation_reservation');
    }
};
