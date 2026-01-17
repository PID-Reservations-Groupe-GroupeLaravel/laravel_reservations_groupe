<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        $locations = [
            [
                'designation' => 'Espace Delvaux / La Vénerie',
                'address' => '3 rue Gratès',
                'locality_postal_code' => '1170',
                'website' => 'https://www.lavenerie.be',
                'phone' => '+32 (0)2/663.85.50',
            ],
            [
                'designation' => 'Dexia Art Center',
                'address' => '50 rue de l\'Ecuyer',
                'locality_postal_code' => '1000',
                'website' => null,
                'phone' => null,
            ],
            [
                'designation' => 'La Samaritaine',
                'address' => '16 rue de la samaritaine',
                'locality_postal_code' => '1000',
                'website' => 'http://www.lasamaritaine.be/',
                'phone' => null,
            ],
            [
                'designation' => 'Espace Magh',
                'address' => '17 rue du Poinçon',
                'locality_postal_code' => '1000',
                'website' => 'http://www.espacemagh.be',
                'phone' => '+32 (0)2/274.05.10',
            ],

            // (Optionnels mais utiles si tu veux “tous les lieux” qu’on avait déjà)
            [
                'designation' => 'Théâtre Le Public',
                'address' => 'Rue Braemt 64-70',
                'locality_postal_code' => '1210',
                'website' => 'https://www.theatrepublic.be',
                'phone' => '+32 (0)2/724.24.44',
            ],
            [
                'designation' => 'Théâtre National Wallonie-Bruxelles',
                'address' => 'Boulevard Émile Jacqmain 111-115',
                'locality_postal_code' => '1000',
                'website' => 'https://www.theatrenational.be',
                'phone' => '+32 (0)2/203.53.03',
            ],
        ];

        // Générer slug depuis designation
        foreach ($locations as &$loc) {
            $loc['slug'] = Str::slug($loc['designation'], '-');
        }
        unset($loc);

        DB::table('locations')->upsert(
            $locations,
            ['slug'], // slug est unique dans ta migration
            ['designation', 'address', 'locality_postal_code', 'website', 'phone']
        );
    }
}
