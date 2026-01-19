<?php

namespace App\Http\Controllers;

use App\Models\Show;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $shows = Show::all();

        return view('show.index', [
            'shows' => $shows,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $show = Show::find($id);

        // Récupérer les artistes du spectacle et les grouper par type
        $collaborateurs = [];

        if ($show) {
            foreach ($show->artistTypes as $at) {
                $collaborateurs[$at->type->type][] = $at->artist;
            }
        }

        return view('show.show', [
            'show' => $show,
            'collaborateurs' => $collaborateurs,
        ]);
    }
}
