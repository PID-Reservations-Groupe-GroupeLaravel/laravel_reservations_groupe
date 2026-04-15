<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Commit #47 : feat(B2): create PriceResource API resource
 */
class PriceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'type'       => $this->type,
            'price'      => $this->price,
            'start_date' => $this->start_date,
            'end_date'   => $this->end_date,
        ];
    }
}
