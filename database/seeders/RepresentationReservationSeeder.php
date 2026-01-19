<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Representation;
use App\Models\Reservation;
use App\Models\Price;

class RepresentationReservationSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('representation_reservation')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $reservations = Reservation::all();

        // Représentations du 12/10/2012 20:30:00 (comme dans le PDF)
        $representations = Representation::where('schedule', '2012-10-12 20:30:00')->get();

        // Prix valides (end_date = null) -> adapte si ton champ s'appelle différemment
        $prices = Price::whereNull('end_date')->get();

        if ($reservations->isEmpty() || $representations->isEmpty() || $prices->isEmpty()) {
            return;
        }

        $data = [];

        foreach ($representations as $rep) {
            foreach ($reservations as $res) {
                $data[] = [
                    'representation_id' => $rep->id,
                    'reservation_id' => $res->id,
                    'unit_price' => $prices->random()->price,
                    'quantity' => rand(1, 5),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('representation_reservation')->insert($data);
    }
}
