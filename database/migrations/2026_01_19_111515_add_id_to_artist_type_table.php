<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        /**
         * IMPORTANT:
         * Ta table artist_type a probablement une PRIMARY KEY composite (artist_id, type_id).
         * Cette PRIMARY KEY sert aussi d'index pour les FK.
         * Donc: on ajoute d'abord des index séparés, puis on drop la PK, puis on ajoute id.
         */

        // 1) Ajouter des index sur les colonnes FK (indispensable avant de drop la PK composite)
        Schema::table('artist_type', function (Blueprint $table) {
            // Noms d'index explicites (évite les surprises)
            $table->index('artist_id', 'artist_type_artist_id_index');
            $table->index('type_id', 'artist_type_type_id_index');
        });

        // 2) Supprimer la clé primaire existante (souvent composite artist_id + type_id)
        DB::statement('ALTER TABLE artist_type DROP PRIMARY KEY');

        // 3) Ajouter la colonne id auto-incrémentée (PRIMARY KEY)
        Schema::table('artist_type', function (Blueprint $table) {
            $table->bigIncrements('id')->first();
        });

        // 4) Garder l'unicité du couple (artist_id, type_id)
        Schema::table('artist_type', function (Blueprint $table) {
            $table->unique(['artist_id', 'type_id'], 'artist_type_artist_id_type_id_unique');
        });
    }

    public function down(): void
    {
        // 1) Retirer l'unique
        Schema::table('artist_type', function (Blueprint $table) {
            $table->dropUnique('artist_type_artist_id_type_id_unique');
        });

        // 2) Supprimer la colonne id
        Schema::table('artist_type', function (Blueprint $table) {
            $table->dropColumn('id');
        });

        // 3) Remettre la PK composite
        DB::statement('ALTER TABLE artist_type ADD PRIMARY KEY (artist_id, type_id)');

        // 4) Supprimer les index séparés (la PK composite re-indexe déjà)
        Schema::table('artist_type', function (Blueprint $table) {
            $table->dropIndex('artist_type_artist_id_index');
            $table->dropIndex('artist_type_type_id_index');
        });
    }
};
