<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\View\View;

class LocationController extends Controller
{
    /**
     * Liste des lieux.
     */
    public function index(): View
    {
        $locations = Location::query()
            ->orderBy('designation')
            ->get();

        return view('location.index', compact('locations'));
    }

    /**
     * Détail d'un lieu + ses spectacles.
     */
    public function show(int $id): View
    {
        $location = Location::query()
            ->with(['shows' => function ($q) {
                $q->orderBy('title');
            }])
            ->findOrFail($id);

        return view('location.show', compact('location'));
    }
}
