<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;

class ArtistApiController extends Controller
{
    /**
     * GET /api/artists
     * Liste tous les artistes (JSON + HATEOAS)
     */
    public function index()
    {
        $artists = Artist::all()->map(function (Artist $artist) {
            return $this->formatArtist($artist);
        });

        return response()->json($artists, 200);
    }

    /**
     * POST /api/artists
     * Crée un artiste
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname' => 'required|string|max:60',
            'lastname'  => 'required|string|max:60',
        ]);

        $artist = Artist::create($validated);

        return response()->json($this->formatArtist($artist), 201);
    }

    /**
     * GET /api/artists/{artist}
     * Retourne un artiste précis
     */
    public function show(string $id)
    {
        $artist = Artist::find($id);

        if (!$artist) {
            return response()->json([
                'message' => 'Artist not found'
            ], 404);
        }

        return response()->json($this->formatArtist($artist), 200);
    }

    /**
     * PUT/PATCH /api/artists/{artist}
     * Met à jour un artiste
     */
    public function update(Request $request, string $id)
    {
        $artist = Artist::find($id);

        if (!$artist) {
            return response()->json([
                'message' => 'Artist not found'
            ], 404);
        }

        $validated = $request->validate([
            'firstname' => 'sometimes|required|string|max:60',
            'lastname'  => 'sometimes|required|string|max:60',
        ]);

        $artist->update($validated);

        return response()->json($this->formatArtist($artist), 200);
    }

    /**
     * DELETE /api/artists/{artist}
     * Supprime un artiste
     */
    public function destroy(string $id)
    {
        $artist = Artist::find($id);

        if (!$artist) {
            return response()->json([
                'message' => 'Artist not found'
            ], 404);
        }

        $artist->delete();

        return response()->json([
            'message' => 'Artist deleted'
        ], 200);
    }

    /**
     * Format HATEOAS pour un Artist
     */
    private function formatArtist(Artist $artist): array
    {
        return [
            'id' => $artist->id,
            'firstname' => $artist->firstname,
            'lastname' => $artist->lastname,
            '_links' => [
                'self' => [
                    'href' => route('artists.show', ['artist' => $artist->id]),
                    'method' => 'GET',
                ],
                'create' => [
                    'href' => route('artists.store'),
                    'method' => 'POST',
                ],
                'update' => [
                    'href' => route('artists.update', ['artist' => $artist->id]),
                    'method' => 'PUT',
                ],
                'delete' => [
                    'href' => route('artists.destroy', ['artist' => $artist->id]),
                    'method' => 'DELETE',
                ],
            ],
        ];
    }
}
