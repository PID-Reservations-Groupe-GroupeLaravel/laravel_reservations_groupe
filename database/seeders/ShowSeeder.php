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
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        if (DB::getDriverName() === 'mysql') {
            DB::table('price_show')->truncate();
        } else {
            DB::table('price_show')->delete();
        }

        Show::truncate();

        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        $venerie = Location::where('slug', 'espace-delvaux-la-venerie')->first();
        $dexia   = Location::where('slug', 'dexia-art-center')->first();
        $sama    = Location::where('slug', 'la-samaritaine')->first();

        $user    = \App\Models\User::first();

        $pNormal = Price::where('price', 14.90)->first();
        $pEnfant = Price::where('price', 7.90)->first();
        $pAncien = Price::where('price', 15.90)->first();

        Show::create([
            'slug'        => 'ayiti',
            'title'       => 'Ayiti',
            'description' => "Un homme est bloque a l'aeroport. Questionne par les douaniers, il doit justifier son identite.",
            'poster_url'  => 'ayiti.jpg',
            'duration'    => 90,
            'created_in'  => 2010,
            'user_id'     => $user?->id,
            'location_id' => $venerie?->id,
            'price_id'    => $pNormal?->id,
            'bookable'    => true,
        ]);

        Show::create([
            'slug'        => 'cible-mouvante',
            'title'       => 'Cible mouvante',
            'description' => "Dans ce thriller d'anticipation, des adultes alimentent une crainte envers les enfants ages entre 10 et 12 ans.",
            'poster_url'  => null,
            'duration'    => 90,
            'created_in'  => 2012,
            'user_id'     => $user?->id,
            'location_id' => $dexia?->id,
            'price_id'    => $pEnfant?->id,
            'bookable'    => true,
        ]);

        Show::create([
            'slug'        => 'ceci-nest-pas-un-chanteur-belge',
            'title'       => "Ceci n'est pas un chanteur belge",
            'description' => "Non peut-etre ?! Entre Magritte et Maigret, quatorze nouvelles chansons melees a des textes humoristiques.",
            'poster_url'  => 'claudebelgesaison220.jpg',
            'duration'    => 80,
            'created_in'  => 2014,
            'user_id'     => $user?->id,
            'location_id' => $dexia?->id,
            'price_id'    => $pEnfant?->id,
            'bookable'    => false,
        ]);

        Show::create([
            'slug'        => 'manneke',
            'title'       => 'Manneke... !',
            'description' => "A tour de role, Pierre se joue de ses oncles, tantes, grands-parents et surtout de sa mere.",
            'poster_url'  => 'wayburn.jpg',
            'duration'    => 70,
            'created_in'  => 2011,
            'user_id'     => $user?->id,
            'location_id' => $sama?->id,
            'price_id'    => $pAncien?->id,
            'bookable'    => true,
        ]);
    }
}
