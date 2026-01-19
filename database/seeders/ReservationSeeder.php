<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Reservation;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        // Vider la table proprement
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }
        Reservation::truncate();
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        // Données de test (adapte user_id si besoin)
        $data = [
            ['user_id' => 1, 'status' => 'En attente', 'booking_date' => '2012-10-01 10:00:00'],
            ['user_id' => 1, 'status' => 'Payée',      'booking_date' => '2012-10-02 10:00:00'],
            ['user_id' => 2, 'status' => 'Annulée',    'booking_date' => '2012-10-03 10:00:00'],
            ['user_id' => 2, 'status' => 'Payée',      'booking_date' => '2012-10-04 10:00:00'],
        ];

        Reservation::insert($data);
    }
}
