<?php

namespace App\Http\Controllers;

use App\Models\Artist;
use Illuminate\Http\Request;

class ArtistController extends Controller
{
    public function index()
    {
        $artists = Artist::all();
        return view('artists.index', compact('artists'));
    }

    public function create()
    {
        return view('artists.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'firstname' => 'required|max:60',
            'lastname'  => 'required|max:60',
        ]);

        Artist::create($request->only(['firstname', 'lastname']));

        return redirect()->route('artists.index');
    }

    public function show(Artist $artist)
    {
        return view('artists.show', compact('artist'));
    }

    public function edit(Artist $artist)
    {
        return view('artists.edit', compact('artist'));
    }

    public function update(Request $request, Artist $artist)
    {
        $request->validate([
            'firstname' => 'required|max:60',
            'lastname'  => 'required|max:60',
        ]);

        $artist->update($request->only(['firstname', 'lastname']));

        return redirect()->route('artists.index');
    }

    public function destroy(Artist $artist)
    {
        $artist->delete();

        return redirect()->route('artists.index');
    }
}
