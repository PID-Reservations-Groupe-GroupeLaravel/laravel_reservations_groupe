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
        // Vider la table proprement
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

        // IMPORTANT : on crée une représentation EXACTEMENT au 2012-10-12 20:30:00
        // (pour que ton RepresentationReservationSeeder trouve quelque chose)
        Representation::create([
            'show_id' => $show->id,
            'location_id' => $location->id,
            'schedule' => Carbon::create(2012, 10, 12, 20, 30, 0),
        ]);

        // + une autre représentation (optionnelle)
        Representation::create([
            'show_id' => $show->id,
            'location_id' => $location->id,
            'schedule' => Carbon::now()->addDays(7),
        ]);
    }
}
