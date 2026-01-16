<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Price;

class PriceSeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyage
        Price::truncate();

        // Prix du PDF
        // Ayiti -> 8.50 €
        // Cible mouvante -> 9.00 €
        // Manneke -> 10.50 €
        // Ceci n'est pas un chanteur -> 5.50 €

        Price::create([
            'type' => 'plein',
            'price' => 8.50,
            'description' => 'Tarif plein',
            'start_date' => now(),
            'end_date' => null,
        ]);

        Price::create([
            'type' => 'plein',
            'price' => 9.00,
            'description' => 'Tarif plein',
            'start_date' => now(),
            'end_date' => null,
        ]);

        Price::create([
            'type' => 'plein',
            'price' => 10.50,
            'description' => 'Tarif plein',
            'start_date' => now(),
            'end_date' => null,
        ]);

        Price::create([
            'type' => 'plein',
            'price' => 5.50,
            'description' => 'Tarif plein',
            'start_date' => now(),
            'end_date' => null,
        ]);
    }
}
