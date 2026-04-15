<?php

namespace Database\Factories;

use App\Models\Price;
use Illuminate\Database\Eloquent\Factories\Factory;

class PriceFactory extends Factory
{
    protected $model = Price::class;

    public function definition(): array
    {
        return [
            'type'       => $this->faker->randomElement(['Plein tarif', 'Réduit', 'Étudiant', 'Senior']),
            'price'      => $this->faker->randomFloat(2, 5, 80),
            'start_date' => now()->subMonth(),
            'end_date'   => now()->addYear(),
        ];
    }
}
