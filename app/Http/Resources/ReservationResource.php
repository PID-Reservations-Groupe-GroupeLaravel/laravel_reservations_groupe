<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Commit #32 : feat(B2): create ReservationResource API resource
 * Commit #36 : show with pivot data (quantity, unit_price)
 * Commit #57 : pagination meta added automatically by Laravel
 */
class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'status'       => $this->status,
            'booking_date' => $this->booking_date,
            'user'         => [
                'id'    => $this->user->id,
                'name'  => $this->user->name ?? $this->user->firstname . ' ' . $this->user->lastname,
                'email' => $this->user->email,
            ],
            'representations' => $this->representations->map(fn($r) => [
                'id'          => $r->id,
                'schedule'    => $r->schedule,
                'show_title'  => $r->show->title ?? null,
                'quantity'    => $r->pivot->quantity,
                'unit_price'  => $r->pivot->unit_price,
                'price_id'    => $r->pivot->price_id,
            ]),
            'total' => $this->representations->sum(
                fn($r) => $r->pivot->quantity * $r->pivot->unit_price
            ),
        ];
    }
}
