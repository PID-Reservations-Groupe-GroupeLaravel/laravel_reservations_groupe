<?php

namespace Database\Factories;

use App\Models\Locality;
use App\Models\Location;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LocationFactory extends Factory
{
    protected $model = Location::class;

    public function definition(): array
    {
        $name = $this->faker->company();
        return [
            'slug'                  => Str::slug($name) . '-' . $this->faker->unique()->numberBetween(1, 9999),
            'designation'           => $name,
            'address'               => $this->faker->streetAddress(),
            'locality_postal_code'  => Locality::factory(),
            'website'               => $this->faker->url(),
            'phone'                 => $this->faker->phoneNumber(),
        ];
    }
}
