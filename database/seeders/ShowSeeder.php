<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Models\Show;
use App\Models\Location;
use App\Models\Price;

class ShowSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver les contraintes FK le temps de truncate (évite erreurs)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Show::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Récupération des locations par slug
        $venerie = Location::where('slug', 'espace-delvaux-la-venerie')->first();
        $dexia   = Location::where('slug', 'dexia-art-center')->first();
        $sama    = Location::where('slug', 'la-samaritaine')->first();

        // Récupération des prix (selon ton modèle Price)
        $p850  = Price::where('price', 8.50)->first();
        $p550  = Price::where('price', 5.50)->first();
        $p1050 = Price::where('price', 10.50)->first();

        // Données
        $data = [
            [
                'slug' => 'ayiti',
                'title' => 'Ayiti',
                'description' => "Un homme est bloqué à l’aéroport. Questionné par les douaniers, il doit alors justifier son identité.",
                'poster_url' => null,
                'duration' => 90,
                'created_in' => 2012,
                'location_id' => $venerie?->id,
                'price_id' => $p850?->id,
                'bookable' => true,
            ],
            [
                'slug' => 'ceci-nest-pas-un-chanteur',
                'title' => "Ceci n'est pas un chanteur",
                'description' => null,
                'poster_url' => null,
                'duration' => 80,
                'created_in' => 2012,
                'location_id' => $dexia?->id,
                'price_id' => $p550?->id,
                'bookable' => false,
            ],
            [
                'slug' => 'manneke',
                'title' => 'Manneke...',
                'description' => null,
                'poster_url' => null,
                'duration' => 70,
                'created_in' => 2012,
                'location_id' => $sama?->id,
                'price_id' => $p1050?->id,
                'bookable' => true,
            ],
        ];

        // Sécuriser les slugs (au cas où) + insert
        foreach ($data as &$row) {
            if (empty($row['slug'])) {
                $row['slug'] = Str::slug($row['title'], '-');
            }
        }
        unset($row);

        DB::table('shows')->insert($data);
    }
}
