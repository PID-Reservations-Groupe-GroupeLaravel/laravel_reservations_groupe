<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Vider la table users (optionnel mais pratique)
        DB::table('users')->truncate();

        // Admin
        DB::table('users')->insert([
            'login' => 'admin',
            'firstname' => 'Admin',
            'lastname' => 'System',
            'name' => 'Admin System',          // ✅ IMPORTANT (Breeze + DB)
            'email' => 'admin@test.com',
            'password' => Hash::make('azerty123'),
            'langue' => 'fr',
            'role' => 'admin',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Exemple membre
        DB::table('users')->insert([
            'login' => 'member1',
            'firstname' => 'Mehdi',
            'lastname' => 'User',
            'name' => 'Mehdi User',            // ✅ IMPORTANT
            'email' => 'member1@test.com',
            'password' => Hash::make('azerty123'),
            'langue' => 'fr',
            'role' => 'member',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
