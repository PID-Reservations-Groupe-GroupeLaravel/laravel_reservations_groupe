<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\ArtistSeeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\TypeSeeder;
use Database\Seeders\LocalitySeeder;
use Database\Seeders\PriceSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ArtistSeeder::class,
            UserSeeder::class,
            TypeSeeder::class,
            LocalitySeeder::class,
            PriceSeeder::class,
        ]);
    }
}
