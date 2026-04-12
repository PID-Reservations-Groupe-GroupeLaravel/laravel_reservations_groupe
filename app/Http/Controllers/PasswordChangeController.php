<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class PasswordChangeController extends Controller
{
    public function edit(): View
    {
        return view('profile.password');
    }
}
