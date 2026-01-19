<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Show;
use App\Models\Location;
use App\Models\Price;

class ShowSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver les contraintes FK (MySQL) pour pouvoir truncate
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        // Vider d'abord les tables dépendantes de shows
        // (pivot / dépendances)
        if (DB::getDriverName() === 'mysql') {
            DB::table('price_show')->truncate();
        } else {
            DB::table('price_show')->delete();
        }

        // Vider ensuite shows
        Show::truncate();

        // Réactiver les contraintes FK
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        // Récupérer les locations via slug
        $venerie = Location::where('slug', 'espace-delvaux-la-venerie')->first();
        $dexia   = Location::where('slug', 'dexia-art-center')->first();
        $sama    = Location::where('slug', 'la-samaritaine')->first();

        // Récupérer les prix via valeur
        $p850  = Price::where('price', 8.50)->first();
        $p550  = Price::where('price', 5.50)->first();
        $p1050 = Price::where('price', 10.50)->first();

        // Ayiti
        Show::create([
            'slug' => 'ayiti',
            'title' => 'Ayiti',
            'description' => "Un homme est bloqué à l'aéroport. Questionné par les douaniers, il doit alors justifier son identité, et surtout prouver qu'il est haitien - qu'est-ce qu'être haitien ?",
            'poster_url' => 'ayiti.jpg',
            'duration' => 90,
            'created_in' => 2010,
            'location_id' => $venerie?->id,
            'price_id' => $p850?->id,
            'bookable' => true,
        ]);

        // Cible mouvante (pas d'image pour le moment)
        Show::create([
            'slug' => 'cible-mouvante',
            'title' => 'Cible mouvante',
            'description' => "Dans ce « thriller d’anticipation », des adultes semblent alimenter une crainte féroce envers les enfants âgés entre 10 et 12 ans.",
            'poster_url' => null,
            'duration' => 90,
            'created_in' => 2012,
            'location_id' => $dexia?->id,
            'price_id' => $p550?->id,
            'bookable' => true,
        ]);

        // Ceci n'est pas un chanteur belge
        Show::create([
            'slug' => 'ceci-nest-pas-un-chanteur-belge',
            'title' => "Ceci n'est pas un chanteur belge",
            'description' => "Non peut-être ?!\nEntre Magritte (pour le surréalisme comique) et Maigret (pour le réalisme mélancolique), ce dixième opus semalien propose quatorze nouvelles chansons mêlées à de petits textes humoristiques et à quelques fortes images poétiques.",
            'poster_url' => 'claudebelgesaison220.jpg',
            'duration' => 80,
            'created_in' => 2014,
            'location_id' => $dexia?->id,
            'price_id' => $p550?->id,
            'bookable' => false,
        ]);

        // Manneke... !
        Show::create([
            'slug' => 'manneke',
            'title' => 'Manneke... !',
            'description' => "A tour de rôle, Pierre se joue de ses oncles, tantes, grands-parents et surtout de sa mère.",
            'poster_url' => 'wayburn.jpg',
            'duration' => 70,
            'created_in' => 2011,
            'location_id' => $sama?->id,
            'price_id' => $p1050?->id,
            'bookable' => true,
        ]);
    }
}
