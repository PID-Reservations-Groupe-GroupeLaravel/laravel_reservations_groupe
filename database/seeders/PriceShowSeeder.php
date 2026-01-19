<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Show;
use App\Models\Price;

class PriceShowSeeder extends Seeder
{
    public function run(): void
    {
        // Vider la table pivot
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('price_show')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $data = [];

        $shows = Show::all();
        $prices = Price::all();

        // Associer tous les prix à tous les shows (simple et valide pour test)
        foreach ($shows as $show) {
            foreach ($prices as $price) {
                $data[] = [
                    'show_id' => $show->id,
                    'price_id' => $price->id,
                ];
            }
        }

        if (!empty($data)) {
            DB::table('price_show')->insert($data);
        }
    }
}
