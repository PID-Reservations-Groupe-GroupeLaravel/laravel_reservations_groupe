<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Resources\TicketResource;
use App\Models\Reservation;
use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class TicketApiController extends Controller
{
    public function generate(Request $request, Reservation $reservation): JsonResponse
    {
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Interdit.'], 403);
        }
        if ($reservation->status !== 'Payee') {
            return response()->json(['message' => 'La reservation doit etre Payee pour generer un ticket.'], 422);
        }
        $ticket = Ticket::create([
            'reservation_id' => $reservation->id,
            'qr_code'        => strtoupper(Str::random(32)),
        ]);
        return response()->json(['ticket_id' => $ticket->id, 'qr_code' => $ticket->qr_code, 'created_at' => $ticket->created_at], 201);
    }

    public function index(Request $request, Reservation $reservation): AnonymousResourceCollection|JsonResponse
    {
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Interdit.'], 403);
        }
        return TicketResource::collection($reservation->tickets);
    }
}
