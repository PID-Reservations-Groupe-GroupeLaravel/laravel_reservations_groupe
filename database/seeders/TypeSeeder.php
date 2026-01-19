<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('artist_type')->truncate();
        DB::table('types')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        DB::table('types')->insert([
            ['type' => 'auteur'],
            ['type' => 'scénographe'],
            ['type' => 'comédien'],
        ]);
    }
}
