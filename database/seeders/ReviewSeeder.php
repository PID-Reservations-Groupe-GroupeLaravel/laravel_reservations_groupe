<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Review;
use App\Models\User;
use App\Models\Show;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
     

        $user = User::first();
        $show = Show::first();

        if (!$user || !$show) {
            return;
        }

        Review::create([
            'user_id' => $user->id,
            'show_id' => $show->id,
            'score' => 5,
            'comment' => 'Excellent spectacle !',
        ]);

        Review::create([
            'user_id' => $user->id,
            'show_id' => $show->id,
            'score' => 3,
            'comment' => 'Sympa mais un peu long.',
        ]);
    }
}
