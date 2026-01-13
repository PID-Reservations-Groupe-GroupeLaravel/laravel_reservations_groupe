<?php

namespace App\Http\Controllers;

use App\Models\Show;
use Illuminate\View\View;

class ShowController extends Controller
{
    /**
     * Liste des spectacles.
     */
    public function index(): View
    {
        $shows = Show::query()
            ->with(['location', 'representations.location'])
            ->orderBy('title')
            ->get();

        return view('show.index', compact('shows'));
    }

    /**
     * Détail d'un spectacle.
     */
    public function show(int $id): View
    {
        $show = Show::query()
            ->with(['location', 'representations.location', 'reviews.user'])
            ->findOrFail($id);

        return view('show.show', compact('show'));
    }
}
