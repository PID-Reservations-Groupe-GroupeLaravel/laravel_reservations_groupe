<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function index()
    {
        $revenue = DB::table('representation_reservation')
            ->join('reservations', 'reservations.id', '=', 'representation_reservation.reservation_id')
            ->where('reservations.status', 'Payee')
            ->sum(DB::raw('representation_reservation.quantity * representation_reservation.unit_price'));

        $ticketCount = DB::table('representation_reservation')->sum('quantity');

        $topShows = DB::table('representation_reservation')
            ->join('representations', 'representation_reservation.representation_id', '=', 'representations.id')
            ->join('shows', 'representations.show_id', '=', 'shows.id')
            ->select('shows.title', DB::raw('SUM(representation_reservation.quantity) as total'))
            ->groupBy('shows.id', 'shows.title')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        return response()->json([
            'revenue'      => $revenue,
            'ticket_count' => $ticketCount,
            'top_shows'    => $topShows,
        ]);
    }
}
