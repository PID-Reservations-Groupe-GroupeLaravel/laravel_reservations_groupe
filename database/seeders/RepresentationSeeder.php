<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Representation;
use App\Models\Show;
use App\Models\Location;
use Carbon\Carbon;

class RepresentationSeeder extends Seeder
{
    public function run(): void
    {
        // Empty the table first (avoid FK problems)
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        Representation::truncate();

        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        $show = Show::first();
        $location = Location::first();

        if (!$show || !$location) {
            return;
        }

        // (Garde ton jeu de données actuel)
        Representation::create([
            'show_id' => $show->id,
            'location_id' => $location->id,
            'schedule' => Carbon::now()->addDays(7),
        ]);

        Representation::create([
            'show_id' => $show->id,
            'location_id' => $location->id,
            'schedule' => Carbon::now()->addDays(14),
        ]);
    }
}
