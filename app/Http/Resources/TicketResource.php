<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Commit #52 : feat(B2): create TicketResource API resource
 */
class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'qr_code'        => $this->qr_code,
            'reservation_id' => $this->reservation_id,
            'created_at'     => $this->created_at,
        ];
    }
}
