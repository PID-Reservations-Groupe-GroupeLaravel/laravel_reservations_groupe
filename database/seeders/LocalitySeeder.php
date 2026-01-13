<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Locality;

class LocalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Locality::truncate();

        $data = [
            ['postal_code' => '1000', 'locality' => 'Bruxelles'],
            ['postal_code' => '4000', 'locality' => 'Namur'],
        ];

        DB::table('localities')->insert($data);
    }
}
