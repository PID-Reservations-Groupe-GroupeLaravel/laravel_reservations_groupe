<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Artist;
use App\Models\Type;

class ArtistTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vider la table pivot
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('artist_type')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $data = [
            ['artist_firstname' => 'Daniel',     'artist_lastname' => 'Marcelin',     'type' => 'auteur'],
            ['artist_firstname' => 'Philippe',   'artist_lastname' => 'Laurent',      'type' => 'auteur'],
            ['artist_firstname' => 'Daniel',     'artist_lastname' => 'Marcelin',     'type' => 'scénographe'],
            ['artist_firstname' => 'Philippe',   'artist_lastname' => 'Laurent',      'type' => 'scénographe'],
            ['artist_firstname' => 'Daniel',     'artist_lastname' => 'Marcelin',     'type' => 'comédien'],
            ['artist_firstname' => 'Marius',     'artist_lastname' => 'Von Mayenburg','type' => 'auteur'],
            ['artist_firstname' => 'Olivier',    'artist_lastname' => 'Boudon',       'type' => 'scénographe'],
            ['artist_firstname' => 'Anne Marie', 'artist_lastname' => 'Loop',         'type' => 'comédien'],
            ['artist_firstname' => 'Pietro',     'artist_lastname' => 'Varasso',      'type' => 'comédien'],
            ['artist_firstname' => 'Laurent',    'artist_lastname' => 'Caron',        'type' => 'comédien'],
            ['artist_firstname' => 'Elena',      'artist_lastname' => 'Perez',        'type' => 'comédien'],
            ['artist_firstname' => 'Guillaume',  'artist_lastname' => 'Alexandre',    'type' => 'comédien'],
            ['artist_firstname' => 'Claude',     'artist_lastname' => 'Semal',        'type' => 'auteur'],
            ['artist_firstname' => 'Laurence',   'artist_lastname' => 'Warin',        'type' => 'scénographe'],
            ['artist_firstname' => 'Claude',     'artist_lastname' => 'Semal',        'type' => 'comédien'],
            ['artist_firstname' => 'Pierre',     'artist_lastname' => 'Wayburn',      'type' => 'auteur'],
            ['artist_firstname' => 'Gwendoline', 'artist_lastname' => 'Gauthier',     'type' => 'auteur'],
            ['artist_firstname' => 'Pierre',     'artist_lastname' => 'Wayburn',      'type' => 'comédien'],
            ['artist_firstname' => 'Gwendoline', 'artist_lastname' => 'Gauthier',     'type' => 'comédien'],
        ];

        foreach ($data as &$row) {
            $artist = Artist::where('firstname', $row['artist_firstname'])
                ->where('lastname', $row['artist_lastname'])
                ->first();

            $type = Type::where('type', $row['type'])->first();

            $row = [
                'artist_id' => $artist->id,
                'type_id'   => $type->id,
            ];
        }

        DB::table('artist_type')->insert($data);
    }
}
