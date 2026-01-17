<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['role' => 'admin'],
            ['role' => 'member'],
            ['role' => 'affiliate'],
            ['role' => 'press'],
        ];

        DB::table('roles')->upsert($data, ['role'], []);
    }
}
