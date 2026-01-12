<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    public function create(): View
    {
        return view('auth.register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'login'     => ['required', 'string', 'max:30', 'unique:users,login'],
            'firstname' => ['required', 'string', 'max:60'],
            'lastname'  => ['required', 'string', 'max:60'],
            'langue'    => ['required', 'string', 'size:2'],
            'email'     => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'login'     => $request->login,
            'firstname' => $request->firstname,
            'lastname'  => $request->lastname,
            'langue'    => $request->langue,
            'role'      => 'member',

            // comme la colonne name existe encore :
            'name'      => $request->firstname . ' ' . $request->lastname,

            'email'     => $request->email,
            'password'  => $request->password, // cast "hashed" va hasher automatiquement
        ]);

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('dashboard');
    }
}
