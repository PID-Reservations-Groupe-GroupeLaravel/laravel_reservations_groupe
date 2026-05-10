<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $today = now()->toDateString();

        $entries = [
            ['type' => 'PMR',      'price' => 5.00,  'description' => 'Tarif PMR (mobilité réduite)',  'start_date' => $today],
            ['type' => 'SENIOR',   'price' => 10.00, 'description' => 'Tarif Senior (60 ans et plus)', 'start_date' => $today],
            ['type' => 'ETUDIANT', 'price' => 8.00,  'description' => 'Tarif Étudiant',                'start_date' => $today],
        ];

        foreach ($entries as $entry) {
            $exists = DB::table('prices')->where('type', $entry['type'])->exists();
            if (!$exists) {
                DB::table('prices')->insert($entry);
            }
        }
    }

    public function down(): void
    {
        DB::table('prices')->whereIn('type', ['PMR', 'SENIOR', 'ETUDIANT'])->delete();
    }
};
