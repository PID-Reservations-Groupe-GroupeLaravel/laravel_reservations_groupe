<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Show;
use Illuminate\Http\Request;

class AdminShowController extends Controller
{
    public function index(Request $request)
    {
        $query = Show::with(['location', 'representations']);
        if ($request->filled('title')) {
            $query->where('title', 'like', "%{$request->title}%");
        }
        return response()->json($query->paginate(20));
    }

    public function show(Show $show)
    {
        return response()->json($show->load(['location', 'representations', 'prices']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug'        => 'required|string|max:255|unique:shows,slug',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'poster_url'  => 'nullable|url',
            'duration'    => 'nullable|integer',
            'created_in'  => 'nullable|integer',
            'location_id' => 'nullable|exists:locations,id',
            'bookable'    => 'boolean',
        ]);
        $show = Show::create($data);
        return response()->json($show, 201);
    }

    public function update(Request $request, Show $show)
    {
        $data = $request->validate([
            'slug'        => 'sometimes|string|max:255|unique:shows,slug,' . $show->id,
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'poster_url'  => 'nullable|url',
            'duration'    => 'nullable|integer',
            'created_in'  => 'nullable|integer',
            'location_id' => 'nullable|exists:locations,id',
            'bookable'    => 'boolean',
        ]);
        $show->update($data);
        return response()->json($show);
    }

    public function destroy(Show $show)
    {
        $show->delete();
        return response()->json(['message' => 'Spectacle supprimé.']);
    }
}
