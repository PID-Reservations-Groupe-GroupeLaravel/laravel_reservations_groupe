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
            'description' => "Seul en scene, Daniel Marcelin retrace l'histoire d'Haiti a travers un recit a la fois intime et engage. Coincé dans un aeroport, il revisite ses origines, questionne son identite et partage une reflexion profonde sur l'exil, l'heritage et la resilience d'un peuple. Du temps de la colonisation aux crises contemporaines, le spectacle oscille entre humour, emotion et critique historique pour offrir une experience a la fois pedagogique et profondement humaine.",
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
            'description' => "Oeuvre scenique contemporaine qui explore les notions d'instabilite, de transformation et d'adaptation dans un monde en perpetuel changement. A travers une mise en scene dynamique melant mouvement, corps et espace, le spectacle interroge la place de l'individu face a des reperes qui se deplacent constamment. Les interpretes incarnent cette quete d'equilibre fragile, ou chaque geste devient une tentative de s'ancrer dans une realite incertaine. Entre tension et fluidite, une reflexion sensible sur notre capacite a evoluer et a nous reinventer.",
            'poster_url'  => 'cible-mouvante.jpg',
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
            'description' => "Claude Semal joue habilement avec les codes de la chanson et du theatre pour proposer une satire mordante de l'identite belge. A travers une succession de textes, de chansons et de prises de parole engagees, il deconstruit les cliches et interroge les contradictions d'une societe en quete de sens. Inspire par l'univers surrealiste de Magritte, le spectacle oscille entre humour, provocation et reflexion politique, invitant le spectateur a remettre en question les apparences et ce qui definit reellement une identite nationale et culturelle.",
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
            'description' => "Pierre Wayburn raconte l'histoire d'un homme a travers ses souvenirs d'enfance et sa relation avec sa mere. Ancre dans une Belgique populaire et chaleureuse, le recit mele humour, tendresse et moments de vie profondement humains. A travers des anecdotes du quotidien et des scenes empreintes d'emotion, le spectacle dresse le portrait d'une famille hors du commun, marquee par la simplicite et la force des liens affectifs. Une ode a la memoire, a l'amour filial et aux racines, qui resonne avec sincerite aupres de tous les publics.",
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
