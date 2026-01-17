<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            [
                'login' => 'admin',
                'firstname' => 'Admin',
                'lastname' => 'System',
                'name' => 'Admin System',
                'password' => Hash::make('azerty123'),
                'langue' => 'fr',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'member1@test.com'],
            [
                'login' => 'member1',
                'firstname' => 'Mehdi',
                'lastname' => 'User',
                'name' => 'Mehdi User',
                'password' => Hash::make('azerty123'),
                'langue' => 'fr',
                'role' => 'member',
                'email_verified_at' => now(),
            ]
        );
    }
}
