<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): View
    {
        return view('auth.register');
    }

    /**
     * Handle an incoming registration request.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'login' => ['required', 'string', 'max:255', 'unique:users,login'],
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'langue' => ['required', 'string', 'size:2'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // name obligatoire en DB : on le fabrique
        $validated['name'] = $validated['firstname'] . ' ' . $validated['lastname'];

        //  création user (sans 'role' !)
        $user = User::create([
            'login' => $validated['login'],
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'langue' => $validated['langue'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'], // cast "hashed" dans User => hash auto
        ]);

        // Attacher le rôle "member" via la table pivot role_user
        $memberRole = Role::firstWhere('role', 'member');
        if ($memberRole) {
            $user->roles()->syncWithoutDetaching([$memberRole->id]);
        }

        event(new Registered($user));

        Auth::login($user);

        return redirect()->route('home');
    }
}
