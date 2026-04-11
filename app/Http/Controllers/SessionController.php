<?php

namespace App\Http\Controllers;

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
}
