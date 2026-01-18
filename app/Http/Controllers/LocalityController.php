<?php

namespace App\Http\Controllers;

use App\Models\Locality;
use Illuminate\Http\Request;

class LocalityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $localities = Locality::orderBy('postal_code')->get();

        return view('locality.index', [
            'localities' => $localities,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $postal_code)
    {
        $locality = Locality::where('postal_code', $postal_code)
            ->with('locations')
            ->firstOrFail();

        return view('locality.show', [
            'locality' => $locality,
        ]);
    }
}
