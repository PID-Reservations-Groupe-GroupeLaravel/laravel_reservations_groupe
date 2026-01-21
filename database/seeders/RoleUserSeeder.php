<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use App\Models\Role;
use App\Models\User;

class RoleUserSeeder extends Seeder
{
    public function run(): void
    {
        // Vider la table pivot
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');
        }
        DB::table('role_user')->truncate();
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }

        $data = [];

        // Rôles
        $roleMember = Role::firstWhere('role', 'member');
        $roleAdmin = Role::firstWhere('role', 'admin');
        $rolePress = Role::firstWhere('role', 'press');
        $roleAffiliate = Role::firstWhere('role', 'affiliate');

        // Tous les users => member
        if ($roleMember) {
            foreach (User::all() as $user) {
                $data[] = [
                    'user_id' => $user->id,
                    'role_id' => $roleMember->id,
                ];
            }
        }

        // Le compte login = "admin" devient admin
        if ($roleAdmin) {
            $adminUser = User::firstWhere('login', 'admin');
            if ($adminUser) {
                $data[] = [
                    'user_id' => $adminUser->id,
                    'role_id' => $roleAdmin->id,
                ];
            }

            // (optionnel) si tu veux garder bob et fred admin aussi
            $bob = User::firstWhere('login', 'bob');
            if ($bob) {
                $data[] = [
                    'user_id' => $bob->id,
                    'role_id' => $roleAdmin->id,
                ];
            }

            $fred = User::firstWhere('login', 'fred');
            if ($fred) {
                $data[] = [
                    'user_id' => $fred->id,
                    'role_id' => $roleAdmin->id,
                ];
            }
        }

        // 5 critiques presse
        if ($rolePress) {
            $critics = User::offset(3)->limit(5)->get();
            foreach ($critics as $critic) {
                $data[] = [
                    'user_id' => $critic->id,
                    'role_id' => $rolePress->id,
                ];
            }
        }

        // 3 affiliés
        if ($roleAffiliate) {
            $affiliates = User::offset(8)->limit(3)->get();
            foreach ($affiliates as $affiliate) {
                $data[] = [
                    'user_id' => $affiliate->id,
                    'role_id' => $roleAffiliate->id,
                ];
            }
        }

        if (!empty($data)) {
            DB::table('role_user')->insert($data);
        }
    }
}
