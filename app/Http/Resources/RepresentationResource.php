<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Commit #45 : feat(B2): create RepresentationResource
 */
class RepresentationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'       => $this->id,
            'schedule' => $this->schedule,
            'show'     => $this->whenLoaded('show', fn() => [
                'id'    => $this->show->id,
                'title' => $this->show->title,
                'slug'  => $this->show->slug,
            ]),
            'location' => $this->whenLoaded('location', fn() => [
                'id'          => $this->location->id,
                'designation' => $this->location->designation,
            ]),
        ];
    }
}
