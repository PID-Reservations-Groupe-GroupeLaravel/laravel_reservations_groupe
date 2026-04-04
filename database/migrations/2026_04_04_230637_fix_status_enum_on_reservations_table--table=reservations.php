<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
public function up(): void
{
Schema::table('reservations', function (Blueprint $table) {
// Changer le type de status : VARCHAR -> ENUM
$table->enum('status', ['PENDING', 'CONFIRMED', 'CANCELLED'])->default('PENDING')->change();
});
}
public function down(): void
{
Schema::table('reservations', function (Blueprint $table) {
// Revenir au VARCHAR si on rollback
$table->string('status', 60)->default('PENDING')->change();
});
}
};