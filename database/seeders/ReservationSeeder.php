<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['user_id' => 1, 'status' => 'En attente', 'booking_date' => '2024-08-05 17:19:55', 'updated_at' => null],
            ['user_id' => 1, 'status' => 'Annulée',    'booking_date' => '2024-08-05 17:19:55', 'updated_at' => null],
            ['user_id' => 1, 'status' => 'Payée',      'booking_date' => '2024-08-05 17:19:55', 'updated_at' => null],
            ['user_id' => 2, 'status' => 'Payée',      'booking_date' => '2024-08-05 17:19:55', 'updated_at' => null],
        ];

        // on évite les doublons : user_id + status + booking_date comme “clé logique”
        DB::table('reservations')->upsert(
            $data,
            ['user_id', 'status', 'booking_date'],
            ['updated_at']
        );
    }
}
