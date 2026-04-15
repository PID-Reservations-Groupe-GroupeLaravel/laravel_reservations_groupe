<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Representation;
use App\Models\Show;
use Illuminate\Database\Eloquent\Factories\Factory;

class RepresentationFactory extends Factory
{
    protected $model = Representation::class;

    public function definition(): array
    {
        return [
            'show_id'     => Show::factory(),
            'location_id' => Location::factory(),
            'schedule'    => $this->faker->dateTimeBetween('now', '+6 months'),
        ];
    }
}
