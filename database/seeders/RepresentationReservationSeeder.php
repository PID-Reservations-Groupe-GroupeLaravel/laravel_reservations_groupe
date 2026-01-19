<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RepresentationReservationSeeder extends Seeder
{
    public function run(): void
    {
        // Sécurité MySQL
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('representation_reservation')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('representation_reservation')->insert([
            [
                'representation_id' => 2,
                'reservation_id'    => 1,
                'unit_price'        => 14.90,
                'quantity'          => 4,
            ],
            [
                'representation_id' => 2,
                'reservation_id'    => 2,
                'unit_price'        => 7.90,
                'quantity'          => 5,
            ],
            [
                'representation_id' => 2,
                'reservation_id'    => 3,
                'unit_price'        => 14.90,
                'quantity'          => 1,
            ],
            [
                'representation_id' => 2,
                'reservation_id'    => 4,
                'unit_price'        => 7.90,
                'quantity'          => 5,
            ],
        ]);
    }
}
