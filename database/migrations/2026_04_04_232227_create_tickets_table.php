<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
public function up(): void
{
Schema::create('tickets', function (Blueprint $table) {
$table->id();
$table->foreignId('reservation_id')->constrained('reservations')->cascadeOnDelete()->cascadeOnUpdate();
// QR code unique par billet
$table->string('qr_code', 255)->unique();
// Pas de updated_at : un billet ne se modifie pas
$table->timestamp('created_at')->useCurrent();
});
}
public function down(): void
{
Schema::dropIfExists('tickets');
}
};