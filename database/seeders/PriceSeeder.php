<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Price;

class PriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Empty the table first
        Price::truncate();

        //Define data
        $data = [
            [
                'type' => 'normal (ancien tarifs)',
                'price' => 14.90,
                'description' => 'Ancien tarif normal.',
                'start_date' => '2020-01-01',
                'end_date' => '2023-12-31',
            ],
            [
                'type' => 'normal',
                'price' => 15.90,
                'description' => 'Prix normal actuel.',
                'start_date' => '2024-01-01',
                'end_date' => '9999-12-31',
            ],
            [
                'type' => 'enfants',
                'price' => 7.90,
                'description' => 'Tarif enfant <12 ans.',
                'start_date' => '2020-01-01',
                'end_date' => '9999-12-31',
            ],
        ];

        //Insert data in the table
        DB::table('prices')->insert($data);
    }
}
