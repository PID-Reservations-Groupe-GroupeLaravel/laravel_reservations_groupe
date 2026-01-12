<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Database\Seeders\ArtistSeeder;
use Database\Seeders\UserSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            ArtistSeeder::class,
            UserSeeder::class,
        ]);
    }
}
