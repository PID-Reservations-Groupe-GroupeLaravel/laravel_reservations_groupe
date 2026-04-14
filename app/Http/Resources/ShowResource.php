<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Commit #42 : feat(B2): create ShowResource API resource
 */
class ShowResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'slug'       => $this->slug,
            'poster_url' => $this->poster_url,
            'duration'   => $this->duration,
            'created_in' => $this->created_in,
            'bookable'   => $this->bookable,
            'location'   => $this->whenLoaded('location', fn() => [
                'id'          => $this->location->id,
                'designation' => $this->location->designation,
                'address'     => $this->location->address,
            ]),
        ];
    }
}
