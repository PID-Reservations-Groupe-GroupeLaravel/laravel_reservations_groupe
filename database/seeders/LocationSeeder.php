<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // Nettoyage
        DB::table('locations')->truncate();

        // Données (ajoute ici TOUS les lieux du PDF)
        $data = [
            [
                'slug' => 'espace-delvaux-la-venerie',
                'designation' => 'Espace Delvaux / La Vénerie',
                'address' => 'Rue Gratès 3',
                'locality_postal_code' => '1000',
                'website' => 'https://www.lavenerie.be',
                'phone' => '+32 (0)2/663.85.50',
            ],

            [
                'slug' => 'la-samaritaine',
                'designation' => 'La Samaritaine',
                'address' => 'Rue de l\'Église 16',
                'locality_postal_code' => '1040',
                'website' => 'https://www.lasamaritaine.be',
                'phone' => null,
            ],
            [
                'slug' => 'theatre-le-public',
                'designation' => 'Théâtre Le Public',
                'address' => 'Rue Braemt 64-70',
                'locality_postal_code' => '1210',
                'website' => 'https://www.theatrepublic.be',
                'phone' => '+32 (0)2/724.24.44',
            ],
            [
                'slug' => 'theatre-national-wallonie-bruxelles',
                'designation' => 'Théâtre National Wallonie-Bruxelles',
                'address' => 'Boulevard Émile Jacqmain 111-115',
                'locality_postal_code' => '1000',
                'website' => 'https://www.theatrenational.be',
                'phone' => '+32 (0)2/203.53.03',
            ],
        ];

        DB::table('locations')->insert($data);
    }
}
