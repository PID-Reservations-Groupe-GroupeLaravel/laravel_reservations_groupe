<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        return [
            'user_id'      => User::factory(),
            'booking_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'status'       => $this->faker->randomElement(['En attente', 'Confirmée', 'Annulée', 'Payée']),
        ];
    }
}
