<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PriceSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            [
                'type' => 'normal',
                'price' => 15.90,
                'description' => 'Tarif normal',
                'start_date' => '2024-01-01',
                'end_date' => '9999-12-31',
            ],
            [
                'type' => 'enfants',
                'price' => 7.90,
                'description' => 'Tarif enfant <12 ans',
                'start_date' => '2020-01-01',
                'end_date' => '9999-12-31',
            ],
            [
                'type' => 'PMR',
                'price' => 5.00,
                'description' => 'Tarif PMR (mobilité réduite)',
                'start_date' => '2024-01-01',
                'end_date' => '9999-12-31',
            ],
            [
                'type' => 'SENIOR',
                'price' => 10.00,
                'description' => 'Tarif Senior (60 ans et plus)',
                'start_date' => '2024-01-01',
                'end_date' => '9999-12-31',
            ],
            [
                'type' => 'ETUDIANT',
                'price' => 8.00,
                'description' => 'Tarif Étudiant',
                'start_date' => '2024-01-01',
                'end_date' => '9999-12-31',
            ],
        ];

        // Delete old/expired prices
        DB::table('prices')->where('end_date', '<', now()->toDateString())->delete();

        DB::table('prices')->upsert(
            $data,
            ['type', 'start_date'], // identifiant logique
            ['price', 'description', 'end_date']
        );
    }
}
