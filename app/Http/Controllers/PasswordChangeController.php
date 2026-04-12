<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\View\View;

class PasswordChangeController extends Controller
{
    public function edit(): View
    {
        return view('profile.password');
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'current_password'      => ['required', 'current_password'],
            'password'              => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        Auth::logoutOtherDevices($request->password);

        return redirect()->route('profile.password.edit')
            ->with('status', 'Mot de passe mis a jour.');
    }
}
