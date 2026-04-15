<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SessionController extends Controller
{
    /**
     * GET /api/profile/sessions
     * Retourne les 10 dernières connexions de l'utilisateur.
     */
    public function index()
    {
        return response()->json([
            'history' => auth()->user()
                ->loginHistory()
                ->latest('logged_at')
                ->limit(10)
                ->get(),
        ]);
    }

    /**
     * DELETE /api/profile/sessions/others
     * Déconnecte tous les autres appareils (requiert le mot de passe).
     */
    public function destroyOthers(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        Auth::logoutOtherDevices($request->password);

        return response()->json(['message' => 'Autres sessions déconnectées.']);
    }
}
