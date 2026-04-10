<?php

namespace App\Http\Controllers;

use App\Models\Show;
use Illuminate\Http\Request;

class ShowApiController extends Controller
{
    /**
     * GET /api/shows
     * Liste tous les spectacles (JSON)
     */
    public function index()
    {
        $shows = Show::all()->map(function (Show $show) {
            return $this->formatShow($show);
        });

        return response()->json($shows, 200);
    }

    /**
     * GET /api/shows/{id}
     * Retourne un spectacle précis avec ses représentations
     */
    public function show(string $id)
    {
        $show = Show::with(['representations', 'prices'])->find($id);

        if (!$show) {
            return response()->json(['message' => 'Show not found'], 404);
        }

        return response()->json($this->formatShow($show, true), 200);
    }

    /**
     * Formate un Show en tableau JSON
     */
    private function formatShow(Show $show, bool $withDetails = false): array
    {
        $data = [
            'id'          => $show->id,
            'slug'        => $show->slug,
            'title'       => $show->title,
            'description' => $show->description,
            'poster_url'  => $show->poster_url,
            'duration'    => $show->duration,
            'created_in'  => $show->created_in,
            'bookable'    => (bool) $show->bookable,
            'status'      => $show->bookable ? 'CONFIRME' : 'A_CONFIRMER',
        ];

        if ($withDetails) {
            $data['representations'] = $show->representations ?? [];
            $data['prices']          = $show->prices ?? [];
        }

        return $data;
    }
}
