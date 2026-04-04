<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
public function up(): void
{
    Schema::table('reservations', function (Blueprint $table) {
        $table->enum('status', ['En attente', 'Payée', 'Annulée'])->default('En attente')->change();
    });
}
public function down(): void
{
Schema::table('reservations', function (Blueprint $table) {
// Revenir au VARCHAR si on rollback
$table->string('status', 60)->default('En attente')->change();
});
}
};