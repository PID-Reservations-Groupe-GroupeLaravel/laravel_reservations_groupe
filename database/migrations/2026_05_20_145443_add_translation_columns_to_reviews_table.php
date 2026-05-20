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
        Schema::table('reviews', function (Blueprint $table) {
            // Colonnes de traduction (FR/EN/NL)
            $table->text('comment_fr')->nullable()->after('comment');
            $table->text('comment_en')->nullable()->after('comment_fr');
            $table->text('comment_nl')->nullable()->after('comment_en');
            $table->string('translated_by')->default('deepl')->after('comment_nl');
            $table->string('source_language')->default('fr')->after('translated_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumnIfExists('comment_fr');
            $table->dropColumnIfExists('comment_en');
            $table->dropColumnIfExists('comment_nl');
            $table->dropColumnIfExists('translated_by');
            $table->dropColumnIfExists('source_language');
        });
    }
};
