<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Désactiver les contraintes FK (MySQL) pour autoriser truncate dans les seeders
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        $this->call([
            ArtistSeeder::class,
            UserSeeder::class,
            TypeSeeder::class,
            LocalitySeeder::class,
            PriceSeeder::class,
            RoleSeeder::class,
        ]);

        // Réactiver les contraintes FK
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
}
