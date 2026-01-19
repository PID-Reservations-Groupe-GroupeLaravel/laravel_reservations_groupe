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
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        DB::table('representation_reservation')->truncate();

        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        $reservations = Reservation::all();

        // Si tu n’as pas cette date dans ta DB, adapte ici (ou enlève le where)
        $representations = Representation::where('schedule', '2012-10-12 20:30:00')->get();

        // Prix valides : end_date = null
        $prices = Price::whereNull('end_date')->get();

        if ($reservations->isEmpty() || $representations->isEmpty() || $prices->isEmpty()) {
            return;
        }

        $data = [];

        foreach ($representations as $repres) {
            foreach ($reservations as $res) {
                $data[] = [
                    'representation_id' => $repres->id,
                    'reservation_id'    => $res->id,
                    'unit_price'        => $prices->random()->price,
                    'quantity'          => rand(1, 5),
                    'created_at'        => now(),
                    'updated_at'        => now(),
                ];
            }
        }

        DB::table('representation_reservation')->insert($data);
    }
}
