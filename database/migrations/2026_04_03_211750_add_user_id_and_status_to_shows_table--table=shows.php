<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
public function up(): void
{
    Schema::table('shows', function (Blueprint $table) {
        // Clé étrangère vers le producteur
        if (!Schema::hasColumn('shows', 'user_id')) {
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->nullOnDelete()->cascadeOnUpdate();
        }
        // Statut de validation du spectacle
        if (!Schema::hasColumn('shows', 'status')) {
            $table->enum('status', ['A_CONFIRMER', 'CONFIRME'])->default('A_CONFIRMER')->after('bookable');
        }
    });
}
public function down(): void
{
Schema::table('shows', function (Blueprint $table) {
$table->dropForeign(['user_id']);
$table->dropColumn(['user_id', 'status']);
});
}
};