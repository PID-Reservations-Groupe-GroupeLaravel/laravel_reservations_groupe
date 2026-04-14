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
    public function store(StoreReservationRequest $request): ReservationResource|JsonResponse { /* TODO */ }
    public function update(UpdateReservationRequest $request, Reservation $reservation): ReservationResource|JsonResponse { /* TODO */ }
    public function destroy(Request $request, Reservation $reservation): JsonResponse { /* TODO */ }
}
