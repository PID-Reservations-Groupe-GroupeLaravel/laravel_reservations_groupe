<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Empty the table first
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // Define data (SANS role, MAIS AVEC name)
        $users = [
            [
                'login' => 'bob',
                'firstname' => 'Bob',
                'lastname' => 'Sull',
                'name' => 'Bob Sull',
                'email' => 'bob@sull.com',
                'password' => '12345678',
                'langue' => 'fr',
            ],
            [
                'login' => 'anna',
                'firstname' => 'Anna',
                'lastname' => 'Lyse',
                'name' => 'Anna Lyse',
                'email' => 'anna.lyse@sull.com',
                'password' => '12345678',
                'langue' => 'en',
            ],
            [
                'login' => 'fred',
                'firstname' => 'Fred',
                'lastname' => 'Sull',
                'name' => 'Fred Sull',
                'email' => 'fred@sull.com',
                'password' => '12345678',
                'langue' => 'fr',
            ],
        ];

        foreach ($users as &$user) {
            $user['email_verified_at'] = Carbon::now()->toDateTimeString();
            $user['created_at'] = Carbon::now()->toDateTimeString();
            $user['updated_at'] = Carbon::now()->toDateTimeString();
            $user['password'] = Hash::make($user['password']);
            $user['remember_token'] = Str::random(10);
        }
        unset($user);

        // Insert data in the table
        DB::table('users')->insert($users);

        // Add 20 randomly generated users
        User::factory(20)->create();
    }
}
