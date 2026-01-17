<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Show;
use App\Models\Location;
use App\Models\Price;

class ShowSeeder extends Seeder
{
    public function run(): void
    {
       

        $venerie = Location::where('slug', 'espace-delvaux-la-venerie')->first();
        $dexia   = Location::where('slug', 'dexia-art-center')->first();
        $sama    = Location::where('slug', 'la-samaritaine')->first();

        $p850  = Price::where('price', 8.50)->first();
        $p550  = Price::where('price', 5.50)->first();
        $p1050 = Price::where('price', 10.50)->first();

        Show::create([
            'slug' => 'ayiti',
            'title' => 'Ayiti',
            'description' => "Un homme est bloqué à l’aéroport. Questionné par les douaniers...",
            'poster_url' => null,
            'duration' => 90,
            'created_in' => 2012,
            'location_id' => $venerie?->id,
            'price_id' => $p850?->id,          // PDF: 8.50€
            'bookable' => true,
        ]);

        Show::create([
            'slug' => 'ceci-nest-pas-un-chanteur',
            'title' => "Ceci n'est pas un chanteur",
            'description' => null,
            'poster_url' => null,
            'duration' => 80,
            'created_in' => 2012,
            'location_id' => $dexia?->id,
            'price_id' => $p550?->id,          // PDF: 5.50€
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
            'price_id' => $p1050?->id,         // PDF: 10.50€
            'bookable' => true,
        ]);
    }
}
