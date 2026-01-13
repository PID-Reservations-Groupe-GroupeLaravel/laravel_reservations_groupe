<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Show;
use App\Models\Location;

class ShowSeeder extends Seeder
{
    public function run(): void
    {
        // FK MySQL : si besoin, on évite truncate bloqué
        \DB::statement('SET FOREIGN_KEY_CHECKS=0');
        Show::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $loc1 = Location::where('slug', 'espace-delvaux-la-venerie')->first();
        $loc2 = Location::where('slug', 'dexia-art-center')->first();

        $data = [
            [
                'slug' => 'ayiti',
                'title' => 'Ayiti',
                'description' => "Un homme est bloqué à l’aéroport.\nQuestionné par les douaniers...",
                'poster_url' => null,
                'duration' => 90,
                'created_in' => 2012,
                'location_id' => $loc1?->id,
                'bookable' => true,
            ],
            [
                'slug' => 'cible-mouvante',
                'title' => 'Cible mouvante',
                'description' => null,
                'poster_url' => null,
                'duration' => 75,
                'created_in' => 2011,
                'location_id' => $loc2?->id,
                'bookable' => false,
            ],
        ];

        foreach ($data as &$row) {
            $row['slug'] = Str::slug($row['slug'], '-');
        }

        Show::insert($data);
    }
}
