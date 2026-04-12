<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class SessionController extends Controller
{
    public function index(): View
    {
        return view('profile.sessions', [
            'history' => auth()->user()
                ->loginHistory()
                ->latest('logged_at')
                ->limit(10)
                ->get(),
        ]);
    }

    public function destroyOthers(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        Auth::logoutOtherDevices($request->password);

        return back()->with('status', 'Autres sessions deconnectees.');
    }
}
