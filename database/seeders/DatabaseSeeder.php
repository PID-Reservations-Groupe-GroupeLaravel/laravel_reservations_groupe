<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver FK (MySQL)
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        /**
         * IMPORTANT : vider dans l'ordre ENFANTS -> PARENTS
         */

        // --- PIVOTS (enfants) ---
        // pivot User <-> Role
        if (DB::getSchemaBuilder()->hasTable('role_user')) {
            DB::table('role_user')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('representation_reservation')) {
            DB::table('representation_reservation')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('artist_type_show')) {
            DB::table('artist_type_show')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('artist_type')) {
            DB::table('artist_type')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('price_show')) {
            DB::table('price_show')->truncate();
        }

        // --- DEPENDANTS DE SHOWS ---
        if (DB::getSchemaBuilder()->hasTable('representations')) {
            DB::table('representations')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('reviews')) {
            DB::table('reviews')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('reservations')) {
            DB::table('reservations')->truncate();
        }

        // --- PARENT : shows ---
        if (DB::getSchemaBuilder()->hasTable('shows')) {
            DB::table('shows')->truncate();
        }

        // --- PARENTS DE SHOWS ---
        if (DB::getSchemaBuilder()->hasTable('locations')) {
            DB::table('locations')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('prices')) {
            DB::table('prices')->truncate();
        }

        // --- DEPENDANCES DIVERSES ---
        if (DB::getSchemaBuilder()->hasTable('artists')) {
            DB::table('artists')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('types')) {
            DB::table('types')->truncate();
        }

        // --- AUTH / ROLES ---
        if (DB::getSchemaBuilder()->hasTable('roles')) {
            DB::table('roles')->truncate();
        }

        if (DB::getSchemaBuilder()->hasTable('users')) {
            DB::table('users')->truncate();
        }

        // --- LOCALITIES ---
        if (DB::getSchemaBuilder()->hasTable('localities')) {
            DB::table('localities')->truncate();
        }

        /**
         * Seed dans l'ordre PARENTS -> ENFANTS
         *  FK restent désactivées pendant les inserts
         */
        $this->call([
            // Auth
            RoleSeeder::class,
            UserSeeder::class,
            RoleUserSeeder::class,

            // Artists / types
            TypeSeeder::class,
            ArtistSeeder::class,
            ArtistTypeSeeder::class,

            // Localities / locations
            LocalitySeeder::class,
            LocationSeeder::class,

            // Prices / shows
            PriceSeeder::class,
            ShowSeeder::class,

            // Pivots show <-> price et artistType <-> show
            PriceShowSeeder::class,
            ArtistTypeShowSeeder::class,

            // Dépendants des shows
            RepresentationSeeder::class,
            ReservationSeeder::class,
            ReviewSeeder::class,

            // Pivot representation <-> reservation
            RepresentationReservationSeeder::class,
        ]);

        // Réactiver FK (MySQL) 
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
}
