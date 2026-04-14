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
    public function index(Request $request): ReservationCollection { /* TODO */ }
    public function show(Request $request, Reservation $reservation): ReservationResource|JsonResponse { /* TODO */ }
    public function store(StoreReservationRequest $request): ReservationResource|JsonResponse { /* TODO */ }
    public function update(UpdateReservationRequest $request, Reservation $reservation): ReservationResource|JsonResponse { /* TODO */ }
    public function destroy(Request $request, Reservation $reservation): JsonResponse { /* TODO */ }
}
