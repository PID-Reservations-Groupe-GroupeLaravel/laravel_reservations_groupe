<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\DB;
use App\Models\Type;

class TypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Empty the table first
        Type::truncate();

        //Define data
        $types = [
            ['type' => 'comédien'],
            ['type' => 'scénographe'],
            ['type' => 'auteur'],
        ];

        //Insert data in the table
        DB::table('types')->insert($types);
    }
}
