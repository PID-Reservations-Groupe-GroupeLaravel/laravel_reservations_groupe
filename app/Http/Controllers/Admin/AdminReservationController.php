<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['user', 'representations.show']);
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('show_id')) {
            $query->whereHas('representations', function ($q) use ($request) {
                $q->where('show_id', $request->show_id);
            });
        }
        return response()->json($query->paginate(20));
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $data = $request->validate([
            'status' => 'required|string|in:En attente,Payee,Annulee',
        ]);
        $reservation->update($data);
        return response()->json($reservation);
    }

    public function exportCsv()
    {
        $reservations = Reservation::with(['user', 'representations.show'])->get();

        $headers = [
            'Content-Type'        => 'text/csv',
            'Content-Disposition' => 'attachment; filename="reservations.csv"',
        ];

        $callback = function () use ($reservations) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Utilisateur', 'Email', 'Spectacle', 'Date', 'Statut', 'Quantité', 'Prix unitaire']);
            foreach ($reservations as $reservation) {
                foreach ($reservation->representations as $rep) {
                    fputcsv($handle, [
                        $reservation->id,
                        $reservation->user?->name,
                        $reservation->user?->email,
                        $rep->show?->title,
                        $rep->schedule,
                        $reservation->status,
                        $rep->pivot->quantity,
                        $rep->pivot->unit_price,
                    ]);
                }
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
