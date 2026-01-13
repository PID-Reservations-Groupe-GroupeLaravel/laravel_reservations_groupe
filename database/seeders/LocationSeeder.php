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
            'address' => 'Rue Grates 3',
            'locality_postal_code' => '1000',
            'website' => 'https://www.lavenerie.be',
            'phone' => '+32 (0)2/663.85.50',
        ]);

        Location::create([
            'slug' => 'dexia-art-center',
            'designation' => 'Dexia Art Center',
            'address' => 'Place Rogier',
            'locality_postal_code' => '1000',
            'website' => null,
            'phone' => null,
        ]);

        Location::create([
            'slug' => 'la-samaritaine',
            'designation' => 'La Samaritaine',
            'address' => 'Rue ...',
            'locality_postal_code' => '1000',
            'website' => 'http://www.lasamaritaine.be/',
            'phone' => null,
        ]);

        Location::create([
            'slug' => 'espace-magh',
            'designation' => 'Espace Magh',
            'address' => 'Rue ...',
            'locality_postal_code' => '1000',
            'website' => 'http://www.espacemagh.be',
            'phone' => null,
        ]);
    }
}
