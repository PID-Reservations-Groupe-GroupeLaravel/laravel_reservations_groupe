<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
public function up(): void
{
Schema::table('representation_reservation', function (Blueprint $table) {
$table->foreignId('price_id')->nullable()->after('reservation_id')->constrained('prices')->nullOnDelete()->cascadeOnUpdate();
});
}
public function down(): void
{
Schema::table('representation_reservation', function (Blueprint $table) {
$table->dropForeign(['price_id']);
$table->dropColumn('price_id');
});
}
};
