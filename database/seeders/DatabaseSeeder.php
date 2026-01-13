<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        $this->call([
            ArtistSeeder::class,
            UserSeeder::class,
            TypeSeeder::class,
            LocalitySeeder::class,
            LocationSeeder::class,
            PriceSeeder::class,
            RoleSeeder::class,
            ShowSeeder::class,
            RepresentationSeeder::class,
            ReviewSeeder::class,
        ]);

        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
}
