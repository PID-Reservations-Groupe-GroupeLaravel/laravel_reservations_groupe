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
        $localities = Locality::all();

        return view('locality.index', [
            'localities' => $localities,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $postal_code)
    {
        $locality = Locality::find($postal_code);

        return view('locality.show', [
            'locality' => $locality,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $postal_code)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $postal_code)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $postal_code)
    {
        //
    }
}
