<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\UpdateReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Http\Resources\ReservationCollection;
use App\Models\Price;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReservationApiController extends Controller
{
    public function index(Request $request): ReservationCollection
    {
        $reservations = $request->user()
            ->reservations()
            ->with(['representations.show'])
            ->latest('booking_date')
            ->paginate(10);
        return new ReservationCollection($reservations);
    }

    public function show(Request $request, Reservation $reservation): ReservationResource|JsonResponse
    {
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Interdit.'], 403);
        }
        return new ReservationResource($reservation->load(['representations.show']));
    }
    public function store(StoreReservationRequest $request): ReservationResource|JsonResponse
    {
        $price = Price::findOrFail($request->price_id);
        $reservation = Reservation::create([
            'user_id'      => $request->user()->id,
            'status'       => 'En attente',
            'booking_date' => now(),
        ]);
        $reservation->representations()->attach($request->representation_id, [
            'price_id'   => $price->id,
            'unit_price' => $price->price,
            'quantity'   => $request->quantity,
        ]);
        return (new ReservationResource($reservation->load(['representations.show'])))->response()->setStatusCode(201);
    }
    public function update(UpdateReservationRequest $request, Reservation $reservation): ReservationResource|JsonResponse
    {
        if ($reservation->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Interdit.'], 403);
        }
        $reservation->update(['status' => $request->status]);
        return new ReservationResource($reservation);
    }
    public function destroy(Request $request, Reservation $reservation): JsonResponse { /* TODO */ }
}
