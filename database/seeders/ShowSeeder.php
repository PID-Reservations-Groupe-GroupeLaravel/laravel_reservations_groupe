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
            'description' => "Un homme est bloque a l'aeroport de Port-au-Prince. Questionne par les douaniers, il doit justifier son identite, son histoire, ses origines. Seul en scene, Daniel Marcelin incarne avec une intensite bouleversante l'histoire d'Haiti, ses heros, ses tyrans, ses revoltes et son peuple. Un voyage entre le paradis des touristes et la realite d'un peuple qui se bat pour exister.",
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
            'description' => "Dans une societe en proie a une inquietude diffuse, les adultes developpent une peur feroce envers des enfants de 10 a 12 ans, suspectes d'actes de violence et de terrorisme. Inspiree du texte de Marius von Mayenburg, cette piece d'anticipation sociale interroge nos mecanismes de bouc emissaire et la fragilite de nos certitudes face a l'inconnu. Un huis clos saisissant dans la tradition d'Orwell et de Bret Easton Ellis.",
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
            'description' => "Non peut-etre ?! Entre Magritte et Maigret, Claude Semal revient avec quatorze nouvelles chansons melees a des textes humoristiques et poetiques. Un spectacle qui navigue entre tendresse et ironie, ou la belgitude s'assume avec fierte et autodérision. Une soiree inclassable qui melange chanson, slam et comedie pour celebrer l'ame belge dans toute sa complexite.",
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
            'description' => "A tour de role, Pierre incarne avec un talent cameleonesque ses oncles, tantes, grands-parents et surtout sa mere — figure centrale d'un portrait de famille aussi hilarant que touchant. Un seul-en-scene virtuose qui oscille entre comedie pure et moments d'une emotion inattendue, nous plongeant dans l'intimite d'une famille bruxelloise attachante et universelle.",
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
