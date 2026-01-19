<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Champs "projet"
            $table->string('login')->unique()->after('id');
            $table->string('firstname')->after('login');
            $table->string('lastname')->after('firstname');
            $table->string('langue')->default('fr')->after('password');
            $table->string('role')->default('member')->after('langue');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['login']);
            $table->dropColumn(['login', 'firstname', 'lastname', 'langue', 'role']);
        });
    }
};
