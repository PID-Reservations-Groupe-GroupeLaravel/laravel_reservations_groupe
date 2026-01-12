<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('login', 30)->after('id');
            $table->string('firstname', 60)->after('login');
            $table->string('lastname', 60)->after('firstname');
            $table->string('langue', 2);
            $table->enum('role', ['admin', 'member', 'affiliate', 'press'])->default('member');

            $table->unique('login', 'users_login_unique');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_login_unique');
            $table->dropColumn(['login', 'firstname', 'lastname', 'langue', 'role']);
        });
    }
};
