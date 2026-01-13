<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Show;
use App\Models\Location;

class ShowSeeder extends Seeder
{
    public function run(): void
    {
        Show::truncate();

        $loc1 = Location::where('slug', 'espace-delvaux-la-venerie')->first();
        $loc2 = Location::where('slug', 'dexia-art-center')->first();

        Show::create([
            'slug' => 'ayiti',
            'title' => 'Ayiti',
            'description' => "Un homme est bloqué à l’aéroport. Questionné par les douaniers...",
            'poster_url' => null,
            'duration' => 90,
            'created_in' => 2012,
            'location_id' => $loc1?->id,
            'bookable' => true,
        ]);

        Show::create([
            'slug' => 'cible-mouvante',
            'title' => 'Cible mouvante',
            'description' => null,
            'poster_url' => null,
            'duration' => 75,
            'created_in' => 2011,
            'location_id' => $loc2?->id,
            'bookable' => false,
        ]);
    }
}
