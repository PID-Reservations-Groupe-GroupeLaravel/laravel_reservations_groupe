<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Representation;
use App\Models\Show;
use App\Models\Location;
use Carbon\Carbon;

class RepresentationSeeder extends Seeder
{
    public function run(): void
    {
        

        $show = Show::first();
        $location = Location::first();

        if (!$show || !$location) {
            return;
        }

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
