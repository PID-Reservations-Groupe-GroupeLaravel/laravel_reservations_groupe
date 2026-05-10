<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Representation;
use Illuminate\Http\Request;

class AdminRepresentationController extends Controller
{
    public function index(Request $request)
    {
        $query = Representation::with(['show', 'location']);
        if ($request->filled('show_id')) {
            $query->where('show_id', $request->show_id);
        }
        return response()->json($query->paginate(20));
    }

    public function show(Representation $representation)
    {
        return response()->json($representation->load(['show', 'location']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'show_id'     => 'required|exists:shows,id',
            'location_id' => 'required|exists:locations,id',
            'schedule'    => 'required|date',
        ]);
        $representation = Representation::create($data);
        return response()->json($representation, 201);
    }

    public function update(Request $request, Representation $representation)
    {
        $data = $request->validate([
            'show_id'     => 'sometimes|exists:shows,id',
            'location_id' => 'sometimes|exists:locations,id',
            'schedule'    => 'sometimes|date',
        ]);
        $representation->update($data);
        return response()->json($representation);
    }

    public function destroy(Representation $representation)
    {
        $representation->delete();
        return response()->json(['message' => 'Représentation supprimée.']);
    }
}
