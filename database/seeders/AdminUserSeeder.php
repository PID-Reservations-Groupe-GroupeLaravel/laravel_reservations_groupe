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
        $roleAdmin = Role::firstOrCreate(['role' => 'admin']);
        $roleProd  = Role::firstOrCreate(['role' => 'producteur']);

        $admin = User::updateOrCreate(['email' => 'admin@ovatio.be'], [
            'login' => 'admin', 'firstname' => 'Admin', 'lastname' => 'Ovatio',
            'name' => 'Admin Ovatio', 'password' => Hash::make('Admin1234!'), 'langue' => 'fr',
        ]);
        $admin->roles()->syncWithoutDetaching([$roleAdmin->id]);

        $prod = User::updateOrCreate(['email' => 'producteur@ovatio.be'], [
            'login' => 'producteur', 'firstname' => 'Jean', 'lastname' => 'Producteur',
            'name' => 'Jean Producteur', 'password' => Hash::make('Prod1234!'), 'langue' => 'fr',
        ]);
        $prod->roles()->syncWithoutDetaching([$roleProd->id]);
    }
}