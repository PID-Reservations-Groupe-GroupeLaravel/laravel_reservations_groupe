<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocalitySeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['postal_code' => '1000', 'locality' => 'Bruxelles'],
            ['postal_code' => '1040', 'locality' => 'Etterbeek'],
            ['postal_code' => '1050', 'locality' => 'Ixelles'],
            ['postal_code' => '1170', 'locality' => 'Watermael-Boitsfort'],
            ['postal_code' => '1210', 'locality' => 'Saint-Josse-ten-Noode'],
            ['postal_code' => '4000', 'locality' => 'Namur'],
        ];

        DB::table('localities')->upsert(
            $data,
            ['postal_code'],      // clé unique (PK)
            ['locality']          // champs à mettre à jour si existe
        );
    }
}
