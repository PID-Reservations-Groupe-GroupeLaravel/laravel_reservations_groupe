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

        $venerie = Location::where('slug', 'espace-delvaux-la-venerie')->first();
        $dexia   = Location::where('slug', 'dexia-art-center')->first();
        $sama    = Location::where('slug', 'la-samaritaine')->first();
        $magh    = Location::where('slug', 'espace-magh')->first();

        Show::create([
            'slug' => 'ayiti',
            'title' => 'Ayiti',
            'description' => "Un homme est bloqué à l’aéroport. Questionné par les douaniers...",
            'poster_url' => null,
            'duration' => 90,
            'created_in' => 2012,
            'location_id' => $venerie?->id,
            'bookable' => true,
        ]);

        Show::create([
            'slug' => 'cible-mouvante',
            'title' => 'Cible mouvante',
            'description' => null,
            'poster_url' => null,
            'duration' => 75,
            'created_in' => 2011,
            'location_id' => $dexia?->id,
            'bookable' => false,
        ]);

        Show::create([
            'slug' => 'ceci-nest-pas-un-chanteur',
            'title' => "Ceci n'est pas un chanteur",
            'description' => null,
            'poster_url' => null,
            'duration' => 80,
            'created_in' => 2012,
            'location_id' => $dexia?->id,
            'bookable' => false,
        ]);

        Show::create([
            'slug' => 'manneke',
            'title' => 'Manneke...',
            'description' => null,
            'poster_url' => null,
            'duration' => 70,
            'created_in' => 2012,
            'location_id' => $sama?->id,
            'bookable' => true,
        ]);
    }
}
