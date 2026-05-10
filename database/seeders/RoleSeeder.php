<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = ['admin', 'member', 'press', 'producer', 'affiliate'];

        foreach ($roles as $r) {
            Role::updateOrCreate(['role' => $r]);
        }
    }
}
