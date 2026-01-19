<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        /**
         * IMPORTANT : on vide dans l'ordre “ENFANTS -> PARENTS”
         */

        // Pivots
        DB::table('artist_type')->truncate();
        DB::table('price_show')->truncate();

        // Dépendants de shows
        DB::table('representations')->truncate();
        DB::table('reviews')->truncate();
        DB::table('reservations')->truncate();

        // Dépendants de shows (shows lui-même avant ses parents)
        DB::table('shows')->truncate();

        // Parents de shows
        DB::table('locations')->truncate();
        DB::table('prices')->truncate();

        // Dépendances diverses
        DB::table('artists')->truncate();
        DB::table('types')->truncate();

        // Auth / roles
        DB::table('roles')->truncate();
        DB::table('users')->truncate();

        // Localities (parent de locations via locality_postal_code)
        DB::table('localities')->truncate();

        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        /**
         * Seed dans l'ordre : PARENTS -> ENFANTS
         */
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,

            TypeSeeder::class,
            ArtistSeeder::class,

            // table pivot artist_type
            ArtistTypeSeeder::class,

            LocalitySeeder::class,
            LocationSeeder::class,

            PriceSeeder::class,
            ShowSeeder::class,

            RepresentationSeeder::class,
            ReviewSeeder::class,

            ReservationSeeder::class,
        ]);
    }
}
