<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        Location::truncate();

        Location::create([
            'slug' => 'espace-delvaux-la-venerie',
            'designation' => 'Espace Delvaux / La Vénerie',
            'address' => 'Rue Gratès 3',
            'locality_postal_code' => '1170',
        ]);

        Location::create([
            'slug' => 'dexia-art-center',
            'designation' => 'Dexia Art Center',
            'address' => 'Place Rogier',
            'locality_postal_code' => '1210',
        ]);
    }
}
