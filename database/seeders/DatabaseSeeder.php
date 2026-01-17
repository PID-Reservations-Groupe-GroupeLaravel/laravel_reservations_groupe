<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Reset PROPRE (DEV uniquement)
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        // Truncate dans l'ordre (enfants -> parents)
        DB::table('artist_type')->truncate();
        DB::table('price_show')->truncate();
        DB::table('representations')->truncate();
        DB::table('reviews')->truncate();
        DB::table('reservations')->truncate();
        DB::table('locations')->truncate();

        DB::table('shows')->truncate();
        DB::table('artists')->truncate();
        DB::table('types')->truncate();

        DB::table('prices')->truncate();
        DB::table('roles')->truncate();
        DB::table('users')->truncate();
        DB::table('localities')->truncate();

        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        // Seed dans l'ordre (parents -> enfants)
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,

            TypeSeeder::class,
            ArtistSeeder::class,

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
