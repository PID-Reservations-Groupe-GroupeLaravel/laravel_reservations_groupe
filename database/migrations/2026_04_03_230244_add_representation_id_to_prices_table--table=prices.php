<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
public function up(): void
{
Schema::table('prices', function (Blueprint $table) {
$table->foreignId('representation_id')->nullable()->after('id')->constrained('representations')->nullOnDelete()->cascadeOnUpdate();
});
}
public function down(): void
{
Schema::table('prices', function (Blueprint $table) {
$table->dropForeign(['representation_id']);
$table->dropColumn('representation_id');
});
}
};