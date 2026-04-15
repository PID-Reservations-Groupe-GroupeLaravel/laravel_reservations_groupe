<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Show;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ShowFactory extends Factory
{
    protected $model = Show::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(3, false);
        return [
            'slug'       => Str::slug($title) . '-' . $this->faker->unique()->numberBetween(1, 9999),
            'title'      => rtrim($title, '.'),
            'poster_url' => $this->faker->imageUrl(),
            'duration'   => $this->faker->numberBetween(60, 180),
            'created_in' => $this->faker->year(),
            'location_id' => Location::factory(),
            'bookable'   => true,
        ];
    }
}
