<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        // User admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@ovatio.be'],
            [
                'name'      => 'Admin Ovatio',
                'login'     => 'admin',
                'firstname' => 'Admin',
                'lastname'  => 'Ovatio',
                'password'  => Hash::make('Admin1234!'),
                'langue'    => 'fr',
            ]
        );
        $adminRole = Role::where('role', 'admin')->first();
        if ($adminRole) $admin->roles()->syncWithoutDetaching([$adminRole->id]);

        // User producteur
        $prod = User::updateOrCreate(
            ['email' => 'producteur@ovatio.be'],
            [
                'name'      => 'Prod Ovatio',
                'login'     => 'producteur',
                'firstname' => 'Prod',
                'lastname'  => 'Ovatio',
                'password'  => Hash::make('Prod1234!'),
                'langue'    => 'fr',
            ]
        );
        $prodRole = Role::where('role', 'producteur')->first();
        if ($prodRole) $prod->roles()->syncWithoutDetaching([$prodRole->id]);
    }
}
