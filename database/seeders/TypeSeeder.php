<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['type' => 'comédien'],
            ['type' => 'scénographe'],
            ['type' => 'auteur'],
        ];

        DB::table('types')->upsert($data, ['type'], []);
    }
}
