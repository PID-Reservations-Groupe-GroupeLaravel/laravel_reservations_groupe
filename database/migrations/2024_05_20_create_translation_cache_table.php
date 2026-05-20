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
        Schema::create('translation_cache', function (Blueprint $table) {
            $table->id();

            // Hash du contenu source pour lookups rapides
            $table->string('source_hash', 32)->unique()->index();

            // Contenu original
            $table->longText('source_text');

            // Langue source
            $table->string('source_language', 5)->default('auto');

            // Traductions JSON: {"fr": "...", "en": "...", "nl": "..."}
            $table->json('translations')->default('{}');

            // Provider utilisé pour cette traduction
            $table->string('provider', 50)->default('deepl');

            // Métadonnées
            $table->integer('usage_count')->default(1); // Nombre d'accès au cache
            $table->timestamps();
            $table->softDeletes();

            // Index pour les queries courantes
            $table->index('source_language');
            $table->index('provider');
            $table->index('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('translation_cache');
    }
};
