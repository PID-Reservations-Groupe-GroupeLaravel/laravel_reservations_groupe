<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirectGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function callbackGoogle()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Echec de la connexion Google'], 401);
        }

        $user = User::where('provider', 'google')
                    ->where('provider_id', $googleUser->getId())
                    ->first();

        if (!$user) {
            $user = User::where('email', $googleUser->getEmail())->first();
        }

        if (!$user) {
            $user = User::create([
                'name'        => $googleUser->getName(),
                'firstname'   => $googleUser->user['given_name'] ?? $googleUser->getName(),
                'lastname'    => $googleUser->user['family_name'] ?? '',
                'login'       => $googleUser->getEmail(),
                'email'       => $googleUser->getEmail(),
                'photo'       => $googleUser->getAvatar(),
                'provider'    => 'google',
                'provider_id' => $googleUser->getId(),
                'password'    => null,
            ]);

            $memberRole = Role::where('role', 'member')->first();
            if ($memberRole) {
                $user->roles()->attach($memberRole->id);
            }
        } else {
            $user->update([
                'provider'    => 'google',
                'provider_id' => $googleUser->getId(),
            ]);
        }

        $token       = $user->createToken('google-token')->plainTextToken;
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3001');

        $userB64 = base64_encode(json_encode([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'photo' => $user->photo,
        ]));

        return redirect()->away($frontendUrl . '/auth/callback?token=' . $token . '&user=' . $userB64);
    }

    public function redirectApple()
    {
        return Socialite::driver('apple')->stateless()->redirect();
    }

    public function callbackApple()
    {
        try {
            $appleUser = Socialite::driver('apple')->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Echec de la connexion Apple'], 401);
        }

        $user = User::where('provider', 'apple')
                    ->where('provider_id', $appleUser->getId())
                    ->first();

        if (!$user) {
            $user = User::where('email', $appleUser->getEmail())->first();
        }

        if (!$user) {
            $user = User::create([
                'name'        => $appleUser->getName(),
                'firstname'   => $appleUser->user['given_name'] ?? $appleUser->getName(),
                'lastname'    => $appleUser->user['family_name'] ?? '',
                'login'       => $appleUser->getEmail(),
                'email'       => $appleUser->getEmail(),
                'photo'       => $appleUser->getAvatar(),
                'provider'    => 'apple',
                'provider_id' => $appleUser->getId(),
                'password'    => null,
            ]);

            $memberRole = Role::where('role', 'member')->first();
            if ($memberRole) {
                $user->roles()->attach($memberRole->id);
            }
        } else {
            $user->update([
                'provider'    => 'apple',
                'provider_id' => $appleUser->getId(),
            ]);
        }

        $token       = $user->createToken('apple-token')->plainTextToken;
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3001');

        $userB64 = base64_encode(json_encode([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'photo' => $user->photo,
        ]));

        return redirect()->away($frontendUrl . '/auth/callback?token=' . $token . '&user=' . $userB64);
    }
}
