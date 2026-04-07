<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
public function up(): void
{
    if (!Schema::hasTable('api_key')) {
        Schema::create('api_key', function (Blueprint $table) {
            $table->id();
            // La clé API générée (doit être unique)
            $table->string('key', 255)->unique();
            // Propriétaire de la clé
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->cascadeOnUpdate();
            // Date de création uniquement
            $table->timestamp('created_at')->useCurrent();
        });
    }
}
public function down(): void
{
Schema::dropIfExists('api_key');
}
};