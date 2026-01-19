<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Review;
use App\Models\User;
use App\Models\Show;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        // Désactiver FK pour truncate (MySQL)
        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        }

        Review::truncate();

        if (DB::getDriverName() === 'mysql') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        }

        $user = User::first();
        $show1 = Show::first();
        $show2 = Show::skip(1)->first();

        if (!$user || !$show1) {
            return;
        }

        Review::create([
            'user_id' => $user->id,
            'show_id' => $show1->id,
            'score' => 5,
            'comment' => 'Excellent spectacle !',
        ]);

        if ($show2) {
            Review::create([
                'user_id' => $user->id,
                'show_id' => $show2->id,
                'score' => 3,
                'comment' => 'Sympa mais un peu long.',
            ]);
        }
    }
}
