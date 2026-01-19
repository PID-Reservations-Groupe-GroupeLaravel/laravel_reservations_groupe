<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // Champs "projet" (on évite de recréer si déjà là)
            if (!Schema::hasColumn('users', 'login')) {
                $table->string('login')->unique()->after('id');
            }

            if (!Schema::hasColumn('users', 'firstname')) {
                $table->string('firstname')->after('login');
            }

            if (!Schema::hasColumn('users', 'lastname')) {
                $table->string('lastname')->after('firstname');
            }

            if (!Schema::hasColumn('users', 'langue')) {
                $table->string('langue')->default('fr')->after('password');
            }

            // on SUPPRIME la colonne role si elle existe
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {

            // Rollback : on remet role (si tu veux revenir à l'ancien système)
            if (!Schema::hasColumn('users', 'role')) {
                $table->string('role')->default('member')->after('langue');
            }

            // Attention: enlever les colonnes projet en rollback est optionnel.
            // Si tu veux tout supprimer, décommente ci-dessous.
            /*
            if (Schema::hasColumn('users', 'login')) {
                $table->dropUnique(['login']);
            }
            $table->dropColumn(['login', 'firstname', 'lastname', 'langue']);
            */
        });
    }
};
