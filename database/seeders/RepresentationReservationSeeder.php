<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Price;

class RepresentationReservationSeeder extends Seeder
{
    public function run(): void
    {
        // Sécurité MySQL
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('representation_reservation')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Récupérer les prix par montant
        $priceNormal = Price::where('price', 14.90)->first();
        $priceEnfant = Price::where('price', 7.90)->first();

        DB::table('representation_reservation')->insert([
            [
                'representation_id' => 2,
                'reservation_id'    => 1,
                'price_id'          => $priceNormal?->id,
                'unit_price'        => 14.90,
                'quantity'          => 4,
            ],
            [
                'representation_id' => 2,
                'reservation_id'    => 2,
                'price_id'          => $priceEnfant?->id,
                'unit_price'        => 7.90,
                'quantity'          => 5,
            ],
            [
                'representation_id' => 2,
                'reservation_id'    => 3,
                'price_id'          => $priceNormal?->id,
                'unit_price'        => 14.90,
                'quantity'          => 1,
            ],
            [
                'representation_id' => 2,
                'reservation_id'    => 4,
                'price_id'          => $priceEnfant?->id,
                'unit_price'        => 7.90,
                'quantity'          => 5,
            ],
        ]);
    }
}
